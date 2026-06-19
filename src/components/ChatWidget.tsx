import { useState, useRef, useEffect, useCallback } from 'react';

/* ── Types ─────────────────────────────────────── */
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  suggestedMessage?: string;
}

/* ── Constants ─────────────────────────────────── */
const WELCOME_MESSAGE =
  'Chào bạn! 👋 Mình là trợ lý tư vấn thời trang AI của MTR Fashion. Bạn muốn tìm sản phẩm theo màu sắc, chất liệu, mùa mặc, giá hay phong cách nào?';

const QUICK_SUGGESTIONS = [
  '👕 Gợi ý áo thun mùa hè',
  '👗 Tìm váy đi tiệc',
  '🧥 Áo khoác mùa đông',
  '👖 Quần jeans đẹp',
];

const HF_API = 'https://npminhtri-ecommerce-rag-demo.hf.space/gradio_api';

/* ── Helpers ───────────────────────────────────── */
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Gradio SSE v3 with session_hash for server-side state.
 *
 * Flow:
 *   1. POST /queue/join   → { event_id }
 *   2. GET  /queue/data?session_hash=...  (SSE stream)
 *      Listen for 'message' events until we get "process_completed" with our event_id.
 */
function makeSessionHash(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

interface GradioResult {
  data: unknown[];
}

async function gradioCall(
  sessionHash: string,
  fnIndex: number,
  data: unknown[],
): Promise<GradioResult> {
  // 1 — join the queue
  const joinRes = await fetch(`${HF_API}/queue/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data,
      fn_index: fnIndex,
      session_hash: sessionHash,
      event_data: null,
      trigger_id: fnIndex === 0 ? 8 : 1,
    }),
  });

  if (!joinRes.ok) throw new Error(`Queue join failed (${joinRes.status})`);
  const { event_id } = await joinRes.json();

  // 2 — listen for result on the SSE stream
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      es.close();
      reject(new Error('Timeout waiting for AI response'));
    }, 120_000);

    const es = new EventSource(`${HF_API}/queue/data?session_hash=${sessionHash}`);

    // In Gradio, SSE event name is generic 'message', msg type is inside JSON payload
    es.addEventListener('message', (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.event_id === event_id) {
          if (payload.msg === 'process_completed') {
            clearTimeout(timeout);
            es.close();
            if (payload.success === false) {
              reject(new Error(payload.output?.error || 'Gradio processing error'));
            } else {
              resolve({ data: payload.output?.data ?? [] });
            }
          }
        }
      } catch (err) {
        clearTimeout(timeout);
        es.close();
        reject(err);
      }
    });

    es.onerror = () => {
      // Clean close by client doesn't trigger error, but server side aborts might
      clearTimeout(timeout);
      es.close();
      reject(new Error('SSE connection failed'));
    };
  });
}

/** Extract the latest assistant message from the Gradio HTML output. */
function extractBotText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const bubbles = doc.querySelectorAll('.chat-row.assistant .chat-bubble');
  if (bubbles.length === 0) return 'Xin lỗi, mình chưa hiểu. Bạn thử hỏi lại nhé!';
  
  // Replace <br> tags with newlines to preserve formatting
  const bubble = bubbles[0];
  let formattedHtml = bubble.innerHTML;
  formattedHtml = formattedHtml.replace(/<br\s*\/?>/gi, '\n');
  
  const temp = document.createElement('div');
  temp.innerHTML = formattedHtml;
  return temp.textContent?.trim() || 'Xin lỗi, có lỗi xảy ra.';
}

/* ── Component ─────────────────────────────────── */
export default function ChatWidget({ isOpen, onToggle, suggestedMessage }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: uid(), role: 'assistant', content: WELCOME_MESSAGE, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChips, setShowChips] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastSuggestion = useRef('');
  const sessionRef = useRef(makeSessionHash());

  /* auto-scroll */
  const scrollDown = useCallback(
    () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }),
    [],
  );
  useEffect(() => {
    scrollDown();
  }, [messages, loading, scrollDown]);

  /* focus input on open */
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
  }, [isOpen]);

  /* handle external suggestion (from "Ask AI" on product card) */
  useEffect(() => {
    if (suggestedMessage && isOpen && suggestedMessage !== lastSuggestion.current && !loading) {
      lastSuggestion.current = suggestedMessage;
      send(suggestedMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestedMessage, isOpen]);

  /* ── send message ─────────────────────────────── */
  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((p) => [
      ...p,
      { id: uid(), role: 'user', content: trimmed, timestamp: new Date() },
    ]);
    setInput('');
    setLoading(true);
    setShowChips(false);

    const session = sessionRef.current;

    try {
      // Step 1 — append user message (fn_index 0)
      const userResult = await gradioCall(session, 0, [trimmed, null]);
      const stateVal = userResult.data[1];

      // Step 2 — get bot response (fn_index 1, triggered after fn 0)
      const botResult = await gradioCall(session, 1, [stateVal]);
      const finalHtml = (botResult.data[1] as string) || '';

      const botText = extractBotText(finalHtml);
      setMessages((p) => [
        ...p,
        { id: uid(), role: 'assistant', content: botText, timestamp: new Date() },
      ]);
    } catch (err) {
      console.error('Chat API error:', err);
      setMessages((p) => [
        ...p,
        {
          id: uid(),
          role: 'assistant',
          content: 'Xin lỗi, đang có lỗi kết nối đến AI. Bạn vui lòng thử lại sau nhé! 🙏',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    send(input);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function clearChat() {
    setMessages([
      { id: uid(), role: 'assistant', content: WELCOME_MESSAGE, timestamp: new Date() },
    ]);
    setShowChips(true);
    lastSuggestion.current = '';
    // New session = fresh server-side state
    sessionRef.current = makeSessionHash();
  }

  /* ── Render ──────────────────────────────────── */
  return (
    <>
      {/* ─── FAB ─────────────────────────────────── */}
      {!isOpen && (
        <button
          id="chat-fab"
          onClick={onToggle}
          aria-label="Mở chat AI"
          className="chat-fab"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="chat-fab-ping" />
          <span className="chat-fab-dot" />
        </button>
      )}

      {/* ─── Panel ───────────────────────────────── */}
      {isOpen && (
        <div id="chat-panel" className="chat-panel animate-chat-open">
          {/* header */}
          <header className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                  />
                </svg>
              </div>
              <div>
                <div className="chat-title">Stylist AI</div>
                <div className="chat-status">
                  <span className="chat-status-dot" />
                  <span>Đang hoạt động</span>
                </div>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                onClick={clearChat}
                className="chat-header-btn"
                title="Xóa cuộc trò chuyện"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                  />
                </svg>
              </button>
              <button onClick={onToggle} className="chat-header-btn" title="Đóng">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </header>

          {/* messages */}
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                className={`chat-row-custom ${msg.role}`}
                style={{ animationDelay: `${Math.min(i * 0.04, 0.25)}s` }}
              >
                {msg.role === 'assistant' && (
                  <div className="chat-row-avatar">
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                      />
                    </svg>
                  </div>
                )}
                <div className="chat-col">
                  <div className={`chat-bubble-custom ${msg.role}`}>{msg.content}</div>
                  <span className={`chat-time ${msg.role}`}>{fmtTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}

            {/* typing indicator */}
            {loading && (
              <div className="chat-row-custom assistant animate-chat-msg">
                <div className="chat-row-avatar">
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                </div>
                <div className="chat-typing">
                  <span className="dot" style={{ animationDelay: '0s' }} />
                  <span className="dot" style={{ animationDelay: '0.16s' }} />
                  <span className="dot" style={{ animationDelay: '0.32s' }} />
                </div>
              </div>
            )}

            {/* quick-suggestion chips */}
            {showChips && messages.length <= 1 && !loading && (
              <div className="chat-chips">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button key={s} className="chat-chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* composer */}
          <div className="chat-composer">
            <form onSubmit={handleSubmit} className="chat-input-row">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Nhập tin nhắn..."
                rows={1}
                disabled={loading}
                className="chat-input"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`chat-send ${input.trim() ? 'active' : ''}`}
                aria-label="Gửi"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </form>
            <div className="chat-footer-label">Powered by MTR Fashion RAG AI</div>
          </div>
        </div>
      )}
    </>
  );
}
