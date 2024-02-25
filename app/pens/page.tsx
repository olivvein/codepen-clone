"use client";
import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import NoSSR from "@/components/NoSSR";
import Chat from "@/components/Chat";
import { LampDemo } from "@/components/ui/Lamp";
import { useEffect, useState } from "react";
import * as Babel from "@babel/standalone";
import Link from "next/link";

export default function Pen() {
  const [apps, setApps] = useState([]);

  function transpileJSX(jsxCode: string) {
    jsxCode = jsxCode.replace(/```/g, "");
    return Babel.transform(jsxCode, {
      presets: ["react"],
    }).code;
  }

  const deleteApp = (id: string) => {
    fetch("/api/deleteApp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((response) => response)
      .then((data) => {
        console.log(data);
        fetch("/api/saveApp")
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setApps(data);
          });
      });
  };

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
          {apps.map(
            (app: {
              id: string;
              appTitle: string;
              cssCode: string;
              htmlCode: string;
              visibleJsCode: string;
            }) => (
              <div key={app.id} className="bg-gray-900 p-4 rounded m-2">
                {" "}
                <h1>{app.appTitle}</h1>
                <iframe
                  className="w-full h-full"
                  aria-label="Code preview"
                  sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                  srcDoc={`<html><style>${app.cssCode}</style><body>${app.htmlCode}<script type="module">${transpileJSX(app.visibleJsCode)}</script></body></html>`}
                />
                <Link href={`/pens/${app.id}`}>
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-auto px-auto rounded inline-flex items-center ml-4">
                    Open
                  </button>
                </Link>
                <button
                  onClick={() => deleteApp(app.id)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-auto px-auto rounded inline-flex items-center ml-4"
                >
                  Delete
                </button>
              </div>
            )
          )}
        </NoSSR>
      </div>
    </>
  );
}
