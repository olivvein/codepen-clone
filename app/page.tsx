import Footer from "@/components/Footer";
import HomeNav from "@/components/HomeNav";
import Landing from "@/components/Landing";
import LandingCards from "@/components/LandingCards";

export default function Home() {
  return (
    <div className="flex flex-center justify-center flex-col min-h-[50vh] max-w-screen w-[100%] overflow-hidden">
      <div className="bg-cp-color-3 w-screen min-h-screen h-max z-[-10] top-0 fixed"></div>
      <HomeNav />
      <Landing/>
      <LandingCards/>
      <Footer />
    </div>
  );
}
