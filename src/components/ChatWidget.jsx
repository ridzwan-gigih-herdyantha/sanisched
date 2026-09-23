import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
      onBookingChange({
        serviceId: data.service_id || "",
        doctorId: data.doctor_id || "",
      });
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
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            aria-hidden="true"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-ink/30"
          />
        )}
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Clinic assistant and booking"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-hidden border-l border-hairline bg-paper sm:w-[440px]"
          >
          <header className="flex items-start justify-between gap-3 border-b border-hairline bg-paper px-5 py-4">
            <div>
              <h2 className="font-serif text-2xl leading-8 text-ink">Clinic Assistant</h2>
              <p className="text-[13px] text-stone">
                Scheduling and general questions only — not medical advice.
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Close chat"
              className="flex h-11 w-11 items-center justify-center rounded-btn text-stone hover:bg-mist hover:text-ink"
            >
              <CloseIcon />
            </button>
          </header>

          <MessageList messages={messages} loading={loading} />

          {booking ? (
            <div className="max-h-[75%] overflow-y-auto">
              <BookingPanel
                key={`${booking.serviceId}:${booking.doctorId || ""}`}
                initialServiceId={booking.serviceId}
                initialDoctorId={booking.doctorId}
                onDone={finishBooking}
                onCancel={() => onBookingChange(null)}
              />
            </div>
          ) : (
            <div className="border-t border-hairline bg-white px-5 py-4">
              {messages.length === 1 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-btn border border-hairline bg-white px-3 py-2 text-[13px] text-ink transition-colors duration-150 hover:border-clinic"
                    >
                      {q}
                    </button>
                  ))}
                  <button
                    onClick={() => onBookingChange({ serviceId: "" })}
                    className="rounded-btn border border-clinic bg-mist px-3 py-2 text-[13px] font-semibold text-clinic transition-colors duration-150 hover:bg-white"
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
                  aria-label="Message"
                  className="min-w-0 flex-1 rounded-btn border border-hairline bg-white px-3.5 py-3 text-sm focus:border-clinic focus:outline-none"
                />
                <button
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  className="rounded-btn bg-clinic px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-clinic-deep disabled:bg-hairline disabled:text-stone"
                >
                  Send
                </button>
              </div>
            </div>
          )}
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          onClick={() => onOpenChange(true)}
          aria-label="Open chat"
          className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white transition-colors duration-150 hover:bg-clinic sm:right-6 sm:bottom-6"
        >
          <ChatIcon size={24} />
        </button>
      )}
    </>
  );
}
