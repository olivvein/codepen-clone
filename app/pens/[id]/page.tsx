"use client"; 
import { useEffect, useState } from "react";
import * as Babel from "@babel/standalone";
import Navbar from "@/components/Navbar";


export default function Page({ params }: { params: { id: string } }) {
  //make a post request to the server to get the data for the pen
  //use the id to get the data
  //use the data to render the pen

  const { id } = params;

  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch('/api/getApp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id}), // Convertit l'objet JavaScript en chaîne JSON
    })
    .then(response => response.json()) // Convertit la réponse en JSON
    .then(data => {console.log(data);setApps(data);}) // Affiche les données dans la console
    .catch((error) => {
      console.error('Erreur:', error);
    });
  }, []);

  function transpileJSX(jsxCode: string) {
    jsxCode = jsxCode.replace(/```/g, "");
    return Babel.transform(jsxCode, {
      presets: ["react"],
    }).code;
  }

  if (!apps[0]) {
    return <div>loading...</div>;
  }

  return <div className="w-screen h-screen">
    <Navbar />
    {apps.map(
            (app: {
              id: string;
              appTitle: string;
              cssCode: string;
              htmlCode: string;
              visibleJsCode: string;
            }) => (
            <div key={app.id} className="w-screen h-screen">
                <h1>{app.appTitle}</h1>
                <iframe
                    className="w-screen h-screen"
                    aria-label="Code preview"
                    sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                    srcDoc={`<html><style>${app.cssCode}</style><body>${app.htmlCode}<script type="module">${transpileJSX(app.visibleJsCode)}</script></body></html>`}
                />
            </div>
            )
          )}
    </div>;
}
