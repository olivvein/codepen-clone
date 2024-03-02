import Footer from "@/components/Footer";
import HomeNav from "@/components/HomeNav";
import Landing from "@/components/Landing";
import LandingCards from "@/components/LandingCards";
import StartTeam from "@/components/StartTeam";
import { LampDemo } from "@/components/ui/Lamp";
import Pen from "@/app/pens/page";
import Navbar from "@/components/Navbar";


export default function Home() {

  
  return (
    <div className="flex flex-center justify-center flex-col min-h-[50vh] overflow-x-hidden max-w-screen w-[100%] overflow-hidden">
      <div className="bg-cp-color-3 w-screen min-h-screen h-max  top-0 fixed"></div>
      <Navbar />
      <LampDemo />
      

      

    </div>
  );
}
