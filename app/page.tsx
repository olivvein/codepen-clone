import Editor from "@/components/Editor";
import NoSSR from "@/components/NoSSR";

export default function Home() {
  return (
    <div className="flex flex-center justify-center flex-col min-h-[50vh] width-full">
      <NoSSR>
        <Editor />
      </NoSSR>
    </div>
  );
}
