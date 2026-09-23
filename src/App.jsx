import { useState } from "react";
import { MotionConfig } from "motion/react";
import LandingPage from "./components/LandingPage";
import ChatWidget from "./components/ChatWidget";
import useClinicData from "./hooks/useClinicData";

export default function App() {
  const data = useClinicData();
  const [chatOpen, setChatOpen] = useState(false);
  const [booking, setBooking] = useState(null);

  function openBooking({ serviceId = "", doctorId = "" } = {}) {
    setBooking({ serviceId, doctorId });
    setChatOpen(true);
  }

  return (
    <MotionConfig reducedMotion="user">
      <LandingPage data={data} onBook={openBooking} />
      <ChatWidget
        open={chatOpen}
        onOpenChange={setChatOpen}
        booking={booking}
        onBookingChange={setBooking}
      />
    </MotionConfig>
  );
}
