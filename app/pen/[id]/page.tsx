import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import NoSSR from "@/components/NoSSR";
import Chat from "@/components/Chat";
import { LampDemo } from "@/components/ui/Lamp";

export default function Pen({ params }: { params: { id: string } }) {

  const { id } = params;
  const paramsId=id;
  return (
    <>
    
    <div className="flex flex-center justify-center flex-col min-h-[50vh] width-full">
      <Navbar />
      <NoSSR>
        <Editor paramsId={paramsId}/>
      </NoSSR>
    </div>
    </>
    
  );
}
