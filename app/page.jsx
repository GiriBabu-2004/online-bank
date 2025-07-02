import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
// adjust the path if needed
import JourneySection from "../components/JourneySection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    < div className ="bg-white">
      <Navbar className="sticky top-0 z-50 bg-white/50  backdrop-blur-sm" />
      <HeroSection />
      <JourneySection />
      <Footer />
    </div>
  );
}