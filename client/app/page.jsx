import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import JourneySection from "../components/JourneySection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div
      className="w-full min-h-screen bg-[url('/background.png')] bg-repeat bg-[length:350px_350px] bg-center "
      style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        backgroundBlendMode: "overlay",
      }}
    >
      <Navbar className="sticky top-0 z-50 bg-white/50 backdrop-blur-sm " />
      <HeroSection />
      <JourneySection />
      <Footer />
    </div>
  );
}
