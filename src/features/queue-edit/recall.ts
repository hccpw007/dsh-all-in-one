/**
 * 排队消息的撤回与回填。
 *
 * 一次撤回分三步：先把这条排队里的图片字节读回来，再让宿主删掉队列项，
 * 最后用这条消息的内容覆盖输入框（清掉原有文字与附件后写入）。
 * 先读后删是为了在图片读不出来时保住那条排队 —— 队列一旦撤回就找不回来。
 */
import type {
  AttachmentRef,
  ConversationApi,
  ImageAttachmentRef,
  QueuedMessage,
  SessionApi,
  SessionBindingApi,
  SessionsApi,
} from '../../types/plugin'

/** 撤回结果的落点。 */
export type RecallOutcome =
  /** 排队已撤回，内容完整回到输入框。 */
  | 'applied'
  /** 这条消息含无法回填的内容（文件附件等）；排队保持原样。 */
  | 'unsupported'
  /** 输入框正在提交消息，草稿不能改写；排队保持原样。 */
  | 'busy'
  /** 排队已撤回，但图片没能放回输入框。 */
  | 'imageFailed'
  /** 宿主拒绝撤回或图片读取失败；排队与输入框都保持原样。 */
  | 'failed'

/** 撤回一条排队消息所需的宿主能力。 */
export interface RecallDeps {
  sessions: SessionsApi
  conversation: ConversationApi
}

/** 排队投影中本插件读取的部分。 */
interface InboxSnapshot {
  readonly 'next-turn'?: readonly QueuedMessage[]
}

/** 一条排队消息回填输入框所需的内容。 */
interface QueuePlan {
  readonly text: string
  readonly images: readonly ImageAttachmentRef[]
}

/** 图片媒体类型对应的文件扩展名，用于没有原始文件名的图片。 */
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

/**
 * 撤回一条排队消息并把内容放回输入框。
 * @param deps 宿主会话列表与对话服务
 * @param sessionId 排队条所在的会话
 * @param index 该排队消息在排队条里渲染的位置（0 起）
 * @returns 撤回结果，调用方据此给出提示
 */
export async function recallQueuedMessage(
  deps: RecallDeps,
  sessionId: string,
  index: number,
): Promise<RecallOutcome> {
  const binding = deps.sessions.binding?.(sessionId)
  if (binding === undefined) return 'failed'

  // 队列与取消按会话寻址：宿主的 conversation 方法读取调用方上下文里的会话标记，
  // 只有从会话作用域里取出的实例才带标记，根实例上的 updateQueue 会直接拒绝。
  const conversation = resolveScopedConversation(deps, sessionId)
  if (conversation === undefined) {
    console.error('[queue-edit] 取不到会话作用域里的对话服务，无法撤回排队消息:', sessionId)
    return 'failed'
  }

  const item = readVisibleQueue(binding)[index]
  if (item === undefined) return 'failed'

  const plan = readQueuePlan(item)
  if (plan === undefined) return 'unsupported'

  let files: File[]
  try {
    files = await readImageFiles(binding.session, plan.images)
  } catch (error) {
    console.error('[queue-edit] 读取排队消息里的图片失败:', error)
    return 'failed'
  }

  // 先写草稿再撤回：撤回不可逆，若输入框此时已被提交占用，写入会被宿主忽略，
  // 那条排队就再也找不回来。写入没成功时排队原样保留。
  const restored = restoreDraft(conversation, binding, sessionId, plan.text, files)
  if (restored !== 'ready') return restored

  try {
    await conversation.updateQueue(item.id, { kind: 'remove' })
  } catch (error) {
    console.error('[queue-edit] 撤回排队消息失败:', error)
    return 'failed'
  }

  return 'applied'
}

/**
 * 取出绑定在会话语义上的对话服务。
 * @param deps 宿主服务
 * @param sessionId 会话标识
 * @returns 会话作用域里的 conversation 实例；宿主不提供作用域时返回 undefined
 */
function resolveScopedConversation(
  deps: RecallDeps,
  sessionId: string,
): ConversationApi | undefined {
  const scope = deps.sessions.scope?.(sessionId)
  if (scope === undefined) return undefined

  const conversation = scope.get('conversation')
  return typeof conversation === 'object' && conversation !== null
    ? conversation as ConversationApi
    : undefined
}

/**
 * 读出排队条实际渲染的队列。
 *
 * 宿主的排队条会隐藏已经进入正文的本地下发回显，按钮所在的第 N 行必须与这里
 * 过滤后的顺序一致，否则撤回的会是另一条消息。
 * @param binding 会话绑定
 * @returns 与排队条一一对应的队列项
 */
function readVisibleQueue(binding: SessionBindingApi): readonly QueuedMessage[] {
  const inbox = binding.session.projections.faceOf('inbox').getSnapshot()
  const rows = isInboxSnapshot(inbox) ? inbox['next-turn'] ?? [] : []
  const inChat = new Set(binding.session.getSnapshot().pendingSubmissions
    .filter(submission => submission.placement === 'transcript')
    .map(submission => submission.requestId))

  return rows.filter(row => {
    const source = row.source
    return source?.kind !== 'user' || source.rpcId === undefined || !inChat.has(source.rpcId)
  })
}

/**
 * 判定投影快照是否带排队列表。
 * @param value 投影快照
 * @returns 是否为可读取的队列投影
 */
function isInboxSnapshot(value: unknown): value is InboxSnapshot {
  return typeof value === 'object' && value !== null
    && Array.isArray((value as InboxSnapshot)['next-turn'])
}

/**
 * 把一条排队消息拆成输入框需要的文本与图片。
 * @param item 队列项
 * @returns 回填内容；含文件附件或图片引用不完整时返回 undefined（改由宿主原行为处理）
 */
function readQueuePlan(item: QueuedMessage): QueuePlan | undefined {
  let text = ''
  const images: ImageAttachmentRef[] = []

  for (const block of item.content) {
    if (block.type === 'text') {
      text += block.text ?? ''
      continue
    }
    // 文件附件没有客户端读取入口，回填会静默丢内容，干脆不接管
    if (block.type !== 'image') return undefined

    const attachment = asImageRef(block.attachment)
    if (attachment === undefined) return undefined
    images.push(attachment)
  }

  return { text, images }
}

/**
 * 收窄成宿主 readAttachment 需要的完整图片引用。
 * @param value 内容块上的附件字段
 * @returns 字段完整的图片引用；缺字段时返回 undefined
 */
function asImageRef(value: AttachmentRef | undefined): ImageAttachmentRef | undefined {
  if (value === undefined || value.mediaType === undefined) return undefined
  if (value.bytes === undefined || value.width === undefined || value.height === undefined) return undefined

  return value as ImageAttachmentRef
}

/**
 * 把排队消息里的持久化图片读成浏览器文件，供输入框重新上传。
 * @param session 会话对象，读取走它自己的网关权限
 * @param images 队列项里的图片引用，按出现顺序
 * @returns 与图片顺序一致的浏览器文件
 */
async function readImageFiles(
  session: SessionApi,
  images: readonly ImageAttachmentRef[],
): Promise<File[]> {
  const files: File[] = []

  for (const [index, attachment] of images.entries()) {
    const result = await session.readAttachment(attachment)
    if (!result.ok || result.value === undefined) {
      throw new Error(`readAttachment failed: ${result.error?.message ?? 'unknown error'}`)
    }

    const resolved = result.value.attachment
    const extension = IMAGE_EXTENSIONS[resolved.mediaType] ?? 'png'
    const name = resolved.name ?? `image-${index + 1}.${extension}`
    files.push(new File([Uint8Array.from(result.value.data)], name, { type: resolved.mediaType }))
  }

  return files
}

/**
 * 用排队消息的内容覆盖输入框：原有文字与附件全部清掉，再写入新的。
 * @param conversation 对话服务（草稿附件的登记与释放都在这里）
 * @param binding 会话绑定
 * @param sessionId 会话标识
 * @param text 回填的正文
 * @param files 回填的图片文件
 * @returns `ready` 表示输入框已完整写入；其余结果表示排队不应撤回
 */
function restoreDraft(
  conversation: ConversationApi,
  binding: SessionBindingApi,
  sessionId: string,
  text: string,
  files: readonly File[],
): 'ready' | 'busy' | 'imageFailed' {
  const input = conversation.input.for(binding.ctx)

  // 发送中的输入框只读，写入会被宿主忽略，此时撤回排队等于丢消息
  if (input.state.getSnapshot().phase !== 'plain') return 'busy'

  const current = input.state.getSnapshot().attachmentIds
  // 编辑排队消息接管整个输入框：先放掉旧附件占用的预览地址，再写入新内容
  for (const id of current) {
    if (!input.removeAttachment(id)) continue
    conversation.releaseDraftAttachment(id)
  }
  input.setDraft(text)
  input.focus()

  if (files.length === 0) return 'ready'

  // 子代理会话不接受图片上传，图片随之带着提示词一起发送
  const ordinary = binding.session.getSnapshot().subagent === null
  let drafts: readonly { readonly id: string }[]
  try {
    drafts = conversation.createDrafts(sessionId, files, ordinary)
  } catch (error) {
    console.error('[queue-edit] 把图片登记为草稿附件失败:', error)
    return 'imageFailed'
  }

  if (input.addAttachments(drafts.map(draft => draft.id))) return 'ready'

  // 输入框在读取与写入之间进入了提交阶段：释放刚登记的附件，避免预览地址泄漏
  for (const draft of drafts) conversation.releaseDraftAttachment(draft.id)
  return 'busy'
}
