import { useState } from "react";
import { sendChat } from "../lib/api";
import MessageList from "./MessageList";
import BookingPanel from "./BookingPanel";
import { ChatIcon, CloseIcon } from "./icons";

const GREETING = {
  role: "assistant",
  content:
    "Hi! I can help with clinic hours, services, location, and booking an appointment.",
};

const QUICK_REPLIES = ["What are your opening hours?", "Where is the clinic?", "What services do you offer?"];

export default function ChatWidget({ open, onOpenChange, booking, onBookingChange }) {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text = input.trim()) {
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const { ok, data } = await sendChat(
      next.filter((m) => m !== GREETING).map(({ role, content }) => ({ role, content })),
    );
    setLoading(false);

    if (!ok) {
      setMessages([
        ...next,
        { role: "assistant", content: data.error || "Something went wrong." },
      ]);
      return;
    }

    setMessages([...next, { role: "assistant", content: data.reply }]);
    if (data.intent === "booking") {
      onBookingChange({ serviceId: data.service_id || "" });
    }
  }

  function finishBooking(summary) {
    onBookingChange(null);
    setMessages((m) => [
      ...m,
      { role: "assistant", content: `Your appointment is confirmed:\n${summary}` },
    ]);
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-slate-50 sm:inset-auto sm:right-6 sm:bottom-24 sm:h-[min(640px,calc(100vh-8rem))] sm:w-[400px] sm:rounded-2xl sm:shadow-2xl sm:ring-1 sm:ring-slate-200">
          <header className="flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
            <div>
              <h2 className="text-sm font-medium text-slate-900">Clinic Assistant</h2>
              <p className="text-xs text-slate-500">
                Scheduling and general questions only — not medical advice.
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Close chat"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <CloseIcon />
            </button>
          </header>

          <MessageList messages={messages} loading={loading} />

          {booking ? (
            <div className="max-h-[65%] overflow-y-auto">
              <BookingPanel
                key={booking.serviceId}
                initialServiceId={booking.serviceId}
                onDone={finishBooking}
                onCancel={() => onBookingChange(null)}
              />
            </div>
          ) : (
            <div className="border-t border-slate-200 bg-white px-4 py-3">
              {messages.length === 1 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-600 ring-1 ring-slate-300 transition hover:ring-teal-400"
                    >
                      {q}
                    </button>
                  ))}
                  <button
                    onClick={() => onBookingChange({ serviceId: "" })}
                    className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 ring-1 ring-teal-200 transition hover:ring-teal-400"
                  >
                    Book an appointment
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask about hours, services, or book a visit…"
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                />
                <button
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  className="rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition hover:bg-teal-700 disabled:bg-slate-300"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => onOpenChange(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        className={`fixed right-6 bottom-6 z-50 h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg transition hover:bg-teal-700 ${
          open ? "hidden sm:flex" : "flex"
        }`}
      >
        {open ? <CloseIcon size={24} /> : <ChatIcon size={24} />}
      </button>
    </>
  );
}
