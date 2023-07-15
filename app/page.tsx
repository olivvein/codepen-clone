import Footer from "@/components/Footer";
import HomeNav from "@/components/HomeNav";
import Landing from "@/components/Landing";

export default function Home() {
  return (
    <div className="flex flex-center justify-center flex-col min-h-[50vh] w-[100%] bg-none">
      <div className="bg-cp-color-3 w-screen h-screen z-[-1] top-0 fixed"></div>
      <HomeNav />
      <Landing/>
      <Footer />
    </div>
  );
}
