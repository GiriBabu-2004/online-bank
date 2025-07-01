import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar"; // adjust the path if needed
import JourneySection from "../components/JourneySection";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <JourneySection />
    </>
  );
}