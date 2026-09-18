import { useState } from "react";
import LandingPage from "./components/LandingPage";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [booking, setBooking] = useState(null);

  function openBooking(serviceId = "") {
    setBooking({ serviceId });
    setChatOpen(true);
  }

  return (
    <>
      <LandingPage onAsk={() => setChatOpen(true)} onBook={openBooking} />
      <ChatWidget
        open={chatOpen}
        onOpenChange={setChatOpen}
        booking={booking}
        onBookingChange={setBooking}
      />
    </>
  );
}
