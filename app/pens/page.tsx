"use client";
import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import NoSSR from "@/components/NoSSR";
import Chat from "@/components/Chat";
import { LampDemo } from "@/components/ui/Lamp";
import { useEffect, useState } from "react";
import * as Babel from "@babel/standalone";
import Link from "next/link";
import { HoverEffect } from "@/components/ui/Card-Hover-Effect";

export default function Pen() {
  const [apps, setApps] = useState([]);

  const [appsHover, setAppsHover] = useState([
    { title: "", description: "", link: "" },
  ]);

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

  useEffect(() => {
    const appsForHoverEffect = apps.map((app) => {
      return {
        title: app.appTitle,
        description: createChildren(app),
        link: `/pen/${app.id}`,
      };
    });
    console.log(appsForHoverEffect);
    console.log(apps);
    const hh = [...appsForHoverEffect];
    setAppsHover(hh);
  }, [apps]);

  const createChildren = (app: {
    cssCode: any;
    htmlCode: any;
    visibleJsCode: string;
  }) => {
    return (
      <>
        <h1>{app.appTitle}</h1>
        <iframe
          className="w-full  p-4 rounded m-2"
          aria-label="Code preview"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
          srcDoc={`<html><style>${app.cssCode}</style><body>${app.htmlCode}<script type="module">${transpileJSX(app.visibleJsCode)}</script></body></html>`}
        />
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Link href={`/pens/${app.id}`}>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Open
            </button>
          </Link>
          <Link href={`/pen/${app.id}`}>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Edit
            </button>
          </Link>
          <button
            type="button"
            onClick={() => deleteApp(app.id)}
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            Delete
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex flex-center justify-center flex-col min-h-[50vh]  w-full">
        <NoSSR>
        

          <HoverEffect items={appsHover} />
        </NoSSR>
      </div>
    </>
  );
}
