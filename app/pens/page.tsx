"use client";
import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import NoSSR from "@/components/NoSSR";
import Chat from "@/components/Chat";
import { LampDemo } from "@/components/ui/Lamp";
import { useEffect, useState } from "react";
import * as Babel from "@babel/standalone";


export default function Pen() {
    const [apps, setApps] = useState([]);

    function transpileJSX(jsxCode: string) {
        return Babel.transform(jsxCode, {
          presets: ["react"],
        }).code;
      }

    useEffect(() => {
        fetch("/api/saveApp")
            .then((response) => response.json())
            .then((data) => {
            console.log(data);
            setApps(data);
            });
        }, []);
  return (
    <>
    
    <div className="flex flex-center justify-center flex-col min-h-[50vh] width-full">
      
      <NoSSR>
      {apps.map((app) => (
        <div key={app.id}>
          <h1>{app.appTitle}</h1>
              <iframe
                className="w-full h-full"
                aria-label="Code preview"
                sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                srcDoc={`<html><style>${app.cssCode}</style><body>${app.htmlCode}<script type="module">${transpileJSX(app.visibleJsCode)}</script></body></html>`}
              />
        </div>
      ))}
      </NoSSR>
    </div>
    </>
    
  );
}
