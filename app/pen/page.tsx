import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import NoSSR from "@/components/NoSSR";
import Chat from "@/components/Chat";

export default function Pen() {
  return (
    <>
    
    <div className="flex flex-center justify-center flex-col min-h-[50vh] width-full">
          
      <NoSSR>
        
        <Editor />
      </NoSSR>
    </div>
    </>
    
  );
}
