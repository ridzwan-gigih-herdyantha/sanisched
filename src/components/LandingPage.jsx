import Header from "./landing/Header";
import Hero from "./landing/Hero";
import Services from "./landing/Services";
import Doctors from "./landing/Doctors";
import Schedule from "./landing/Schedule";
import HowItWorks from "./landing/HowItWorks";
import About from "./landing/About";
import Hours from "./landing/Hours";
import FinalCta from "./landing/FinalCta";
import Footer from "./landing/Footer";

export default function LandingPage({ data, onBook }) {
  const { clinic, services, doctors, hours, loaded } = data;

  return (
    <>
      <Header clinic={clinic} onBook={onBook} />
      <main>
        <Hero onBook={onBook} />
        <Services services={services} loaded={loaded} onBook={onBook} />
        <Doctors doctors={doctors} loaded={loaded} onBook={onBook} />
        <Schedule doctors={doctors} />
        <HowItWorks />
        <About clinic={clinic} doctors={doctors} services={services} hours={hours} />
        <Hours clinic={clinic} hours={hours} />
        <FinalCta onBook={onBook} />
      </main>
      <Footer clinic={clinic} hours={hours} onBook={onBook} />
    </>
  );
}
