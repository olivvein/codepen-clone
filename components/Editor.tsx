"use client";

import { SetStateAction, use, useContext, useEffect, useState } from "react";
import * as Space from "react-spaces";
import { HtmlCodeContext, HtmlCodeContext2 } from "@/components/Context";
import Chat from "./Chat";
import * as Babel from "@babel/standalone";
import CodeEditor from "./CodeEditor";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { langs } from "@uiw/codemirror-extensions-langs";
import { WavyBackground } from "@/components/ui/wavy-background";
import axios from "axios";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import ImageList from "@/components/ImageList";

export default function Editor(paramsId :{paramsId :string} ) {
  interface Messagess {
    role: string;
    content: string;
  }

  

  useEffect(() => {
    if(paramsId && paramsId.paramsId){
      console.log(paramsId.paramsId);
      if(paramsId.paramsId=="new"){
        console.log("New Pen");

      }else{
        console.log("Existing Pen");
        fetch('/api/getApp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: paramsId.paramsId }), // Convertit l'objet JavaScript en chaîne JSON
        })
        .then(response => response.json()) // Convertit la réponse en JSON
        .then(data => {
          console.log(data[0]);
          setHtmlCode(data[0].htmlCode);
          setVisibleJsCode(data[0].visibleJsCode);
          setJsCode(data[0].visibleJsCode);
        }) // Affiche les données dans la console
        .catch((error) => {
          console.error('Erreur:', error);
        });
      }
    }
  }, []);
  
  const [apps, setApps] = useState(["One"]);
  const [appsForEditor, setAppsForEditor] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");

  const [fullMessages, setFullMessages] = useState([] as Messagess[]);
  const [gtpMessages, setGtpMessages] = useState("");

  //useEffect for gptMessages get only the last message
  useEffect(() => {
    if (fullMessages.length === 0) return;
    const lastMessage = fullMessages[fullMessages.length - 1];

    setGtpMessages(lastMessage.content);
  }, [fullMessages]);

  interface iFrameApp {
    id: string;
    appTitle: string;
    cssCode: string;
    htmlCode: string;
    visibleJsCode: string;
  }

  //make a type for the app
  const [oldApps, setOldApps] = useState<iFrameApp[]>([]);

  const [appTitle, setAppTitle] = useState("CodepAIn");

  const OnLanguageChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedLanguage(event.target.value);
  };

  const [htmlCode, setHtmlCode] =
    useState(`<div id="app" class="h-screen bg-gray-800 flex items-center justify-center">
  <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4">
    <h1 class="text-xl font-bold">Start Coding</h1>
  </div>
</div>`);

  const saveCode = async () => {
  
    const response = await axios.post("/api/saveApp", {
      htmlCode,
      cssCode,
      visibleJsCode,
      appTitle,
    });
    console.log(htmlCode);
    console.log(visibleJsCode);
    console.log("Saved");
  };

  const saveFullCode = (htmlCode: string, cssCode: string, jsCode: string) => {
    let fullCode = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodepAIn</title>
    <style>
      ${cssCode}
    </style>
  </head>
  <body>
    ${htmlCode}
    <script type="module">
      ${jsCode}
    </script>
  </body>
  </html>`;
    console.log(fullCode);
    return fullCode;
  };

  const saveFullCodeMultiple = (
    htmlCode: string,
    cssCode: string,
    jsCode: string
  ) => {
    let fullIframes = "";
    let fullScript = "";

    let fullCodes = [];

    oldApps.forEach((app) => {
      let fullCode = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${app.appTitle}</title>
        <style>
          ${app.cssCode}
        </styl>
      </head>
      <body>
        ${app.htmlCode}
        <script type="module">
          ${app.visibleJsCode}
        </scrip>
      </bod>
      </htm>`;

      fullIframes +=
        `<iframe style={height: ` +
        100 / (oldApps.length + 1) +
        `% } srcdoc="${encodeURIComponent(fullCode)}"
        sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>`;

      fullCodes.push(fullCode);
    });

    let fcode = saveFullCode(htmlCode, cssCode, jsCode);
    fcode = fcode.replace(/style>/g, "styl>");
    fcode = fcode.replace(/script>/g, "scrip>");
    fcode = fcode.replace(/body>/g, "bod>");
    fcode = fcode.replace(/html>/g, "htm>");
    fullCodes.push(fcode);

    fullIframes +=
      `<iframe style={height: ` +
      100 / (oldApps.length + 1) +
      `% } srcdoc="${encodeURIComponent(fcode)}"
        sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>`;

    fullCodes.forEach((code, index) => {
      fullScript +=
        `<script >
      var htmlContent='${code.replace(/\n/g, "").replace(/'/g, "\\'")}';
      htmlContent = htmlContent.replace(/styl>/g,"style>");
      htmlContent = htmlContent.replace(/scrip>/g,"script>");
      htmlContent = htmlContent.replace(/bod>/g,"body>");
      htmlContent = htmlContent.replace(/htm>/g,"html>");
      var iframe = document.createElement('iframe');
      iframe.srcdoc = htmlContent;
      iframe.style="height: ` +
        100 / oldApps.length +
        `%, width: 100%,height: 100%";
      iframe.classList.add("w-full")
      iframe.classList.add("h-full");
      iframe.sandbox = "allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts";

      var iframeContainer=document.getElementById("iframeContainer");
      iframeContainer.appendChild(iframe);
      </script>`;
    });

    let fullCodeFinal = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodepAIn</title>
    <style>
    #iframeContainer {
      display: grid;
      grid-template-rows: ${(1 / fullCodes.length) * 100}% 50%; /* Adjust this as needed */
      height: 100vh; /* This makes the container take the full height of the viewport */
      width: 100%; /* This makes the container take the full width */
    }
    iframe {
      width: 100%; /* Full width */
      height: 100%; /* Adjusted by grid to 50% of the container's height */
      border: none; /* Optional: Removes the default iframe border */
    }
  </style>
    

  </head>
  <body>
  <script type=module>
  import { setup as twindSetup } from 'https://cdn.skypack.dev/twind/shim';
  </script>

  
   
  <div id="iframeContainer" class="w-full h-full">
  </div>
    
  </body>
  ${fullScript}
  </html>`;

    return fullCodeFinal;
  };


  useEffect(() => {
    setHtmlCode(htmlCode);
    setVisibleJsCode(visibleJsCode+"\n//");
    setJsCode(jsCode+"\n//");

  },[gtpMessages]);

  const downloadCode = () => {
    let code = "";
    if (oldApps.length !== 0) {
      code = saveFullCodeMultiple(htmlCode, cssCode, jsCode);
    } else {
      code = saveFullCode(htmlCode, cssCode, jsCode);
    }

    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "index.html";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  function transpileJSX(jsxCode: string) {
    jsxCode = jsxCode.replace(/```/g, "");
    return Babel.transform(jsxCode, {
      presets: ["react"],
    }).code;
  }

  const onChange2 = (newValue: SetStateAction<string>, e: any) => {
    console.log("new Js Code : ");
    if (selectedEditorView === "JS") {
      if(selectedLanguage=="JavaScript"){
        setVisibleJsCode(newValue);
        setJsCode(newValue);
      }
      
      
    } 
    if (selectedEditorView === "HTML") {
      setHtmlCode(newValue);
    } 
  };

  

  

  const detectLanguage = (str: string) => {
    return str.match(/```html|```css|```js|```jsx/)?.[0].replace("```", "") || "";
  };

  const removeMarkDownCodeTags = (str: string) => {
    return str.replace(/```/g, "");
  };
  const removeBodyTags = (str: string) => {
    return str.replace(/<body>/g, "").replace(/<\/body>/g, "");
  };

  const removeHTMLTags = (str: string) => {
    return str.replace("```html", "```").replace(/```/g, "");
  };

  const removeJSTags = (str: string) => {
    return str.replace("```jsx", "```").replace("```js", "```");
  };

  const removeCSSTags = (str: string) => {
    return str.replace("```css", "```");
  };

  const consoleLog = `var oldLog = console.log;var oldError = console.error;
  var logElement = document.getElementById('logs');

  console.log = function (message) {
    
      if (typeof message == 'object') {
          logElement.innerHTML += message + '<br />';
      } else {
        var stack = new Error().stack;
          logElement.innerHTML += message+"\\n"+ stack.split("\\n").slice(2).join("\\n")+  '<br />';
      }
      oldLog.apply(console, arguments);
      
  };

  console.error = function (message) {
    if (typeof message == 'object') {
        logElement.innerHTML += '<span style="color:red">'+message+'</span> '+ '<br />';
    } else {
      var stack = new Error().stack;
        logElement.innerHTML +=  '<span style="color:red">'+message+"\\n"+ stack.split("\\n").slice(2).join("\\n")+'</span> ' + '<br />';
    }
    oldError.apply(console, arguments);
  };`;

  useEffect(() => {
    let newHtmlCode = htmlCode;
    newHtmlCode = removeHTMLTags(newHtmlCode);
    newHtmlCode = removeMarkDownCodeTags(newHtmlCode);

    setHtmlCode(newHtmlCode);
  }, [htmlCode]);

  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState(
    `import { setup as twindSetup } from 'https://cdn.skypack.dev/twind/shim'`
  );

  const [visibleJsCode, setVisibleJsCode] = useState(
    `import { setup as twindSetup } from 'https://cdn.skypack.dev/twind/shim'`
  );

  const [selectedEditorView, setSelectedEditorView] = useState("JS");

  const OnselectedEditorViewChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedEditorView(event.target.value);
  };

  useEffect(() => {
    let newJsCode = jsCode;
    //if newJsCode end with "END" remove it

    newJsCode = removeJSTags(newJsCode);
    newJsCode = removeMarkDownCodeTags(newJsCode);
    newJsCode = newJsCode.replace(/```/g, "");
    try {
      newJsCode = transpileJSX(newJsCode) as string;
    } catch (error) {
      console.log("error on Transpile");
      console.log(error);
      //alert(error);
    }

    setJsCode(newJsCode);
  }, [jsCode]);

  useEffect(() => {
    let newJsCode = removeBodyTags(visibleJsCode);
    newJsCode = removeJSTags(newJsCode);
    newJsCode = removeMarkDownCodeTags(newJsCode);

    setVisibleJsCode(newJsCode);
  }, [visibleJsCode]);

  const [appName, setAppName] = useState("");

  const handleSubmitNewApp = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setApps((prev) => [...prev, appName]);
    setOldApps((prev) => [
      ...prev,
      {
        id: appName,
        appTitle: appName,
        cssCode: cssCode,
        htmlCode: htmlCode,
        visibleJsCode: jsCode,
      },
    ]);
    console.log("Added new app");
    setAppName("");
  };

  const theBasicSetup = { autocompletion: false };

  interface Message {
    role: string;
    content: string;
  }

  interface HtmlCodeContextType {
    fullMessages: Message[] | []; // Updated type
    setFullMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    appTitle: string;
    setAppTitle: React.Dispatch<React.SetStateAction<string>>;
    htmlCode: string;
    setHtmlCode: React.Dispatch<React.SetStateAction<string>>;
    jsCode: string;
    setJsCode: React.Dispatch<React.SetStateAction<string>>;
    visibleJsCode: string;
    setVisibleJsCode: React.Dispatch<React.SetStateAction<string>>;
    cssCode: string;
    setCssCode: React.Dispatch<React.SetStateAction<string>>;
  }

  const [htmlCodes, setHtmlCodes] = useState<HtmlCodeContextType[]>([
    {
      fullMessages: [],
      setFullMessages: () => {},
      appTitle: "",
      setAppTitle: () => {},
      htmlCode: "",
      setHtmlCode: () => {},
      jsCode: "",
      setJsCode: () => {},
      visibleJsCode: "",
      setVisibleJsCode: () => {},
      cssCode: "",
      setCssCode: () => {},
    },
  ]);

  return (
    <HtmlCodeContext.Provider
      value={{
        fullMessages,
        setFullMessages,
        appTitle,
        setAppTitle,
        htmlCode,
        setHtmlCode,
        jsCode,
        setJsCode,
        visibleJsCode,
        setVisibleJsCode,
        cssCode,
        setCssCode,
      }}
    >
      <div className="w-full">
        <Chat />
        <WavyBackground className="overflow-hidden" />

        <Space.ViewPort top={80} className="w-full">
          <Space.Fill trackSize={true}>
            {/* <Space.LeftResizable
              size="50%"
              touchHandleSize={20}
              trackSize={true}
              scrollable={true}
              className="border border-gray-500 opacity-90 bg-gray-800"
            >
              <span className="leading-relaxed h-2 bg-slate-200/10 w-full  sticky  rounded-md dark:bg-slate-900/10 text-slate-900 dark:text-white">
                HTML
              </span>
              
              <CodeMirror
                onChange={handleHtmlChange2}
                basicSetup={theBasicSetup}
                value={htmlCode}
                theme={vscodeDark}
                lang="html"
                height="100%"
                extensions={[javascript({ jsx: true })]}
              />
            </Space.LeftResizable> */}

            {/* <Space.Fill trackSize={true} scrollable={true}>
              <span className="leading-relaxed h-2  bg-slate-200/10 w-full  sticky  rounded-md dark:bg-slate-900/10 text-slate-900 dark:text-white">
                CSS
              </span>

              <textarea
                className="resize-none bg-slate-200/50 w-full h-full  dark:bg-slate-900 text-slate-900 dark:text-white"
                value={cssCode}
                onChange={handleCssChange}
                placeholder="CSS code here..."
              />
            </Space.Fill> */}

            <Space.LeftResizable
              size="100%"
              touchHandleSize={20}
              trackSize={true}
              scrollable={true}
              className="border border-gray-500 opacity-90 bg-gray-800"
            >
              <div className="flex items-center">
                <select
                  value={selectedEditorView}
                  onChange={OnselectedEditorViewChange}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-auto px-auto rounded inline-flex items-center"
                >
                  <option value="HTML">HTML</option>
                  <option value="JS">JS</option>
                  <option value="GPT">GPT</option>
                  <option value="Images">Images</option>
                </select>
                {selectedEditorView === "JS" ? (
                  <select
                    value={selectedLanguage}
                    onChange={OnLanguageChange}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-auto px-auto rounded inline-flex items-center"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="Babel">Babel</option>
                  </select>
                ) : null}

                <button
                  onClick={downloadCode}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-auto px-auto rounded inline-flex items-center ml-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </button>
                <button
                  onClick={saveCode}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-auto px-auto rounded inline-flex items-center ml-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </button>
              </div>

              {/* <textarea
                className="resize-none bg-slate-200/50 w-full  h-full dark:bg-slate-900 text-slate-900 dark:text-white"
                value={visibleJsCode}
                onChange={handleJsChange}
                placeholder="JavaScript code here..."
              /> */}
              {selectedEditorView=="Images" ? <ImageList /> : <CodeMirror
                onChange={onChange2}
                value={
                  selectedEditorView == "GPT"
                    ? gtpMessages
                    : selectedEditorView === "HTML"
                      ? htmlCode
                      : selectedLanguage === "JavaScript"
                        ? visibleJsCode
                        : jsCode
                }
                theme={vscodeDark}
                height="100%"
                lang="javascript"
                extensions={[
                  langs.tsx(),
                  langs.jsx(),
                  markdown({
                    base: markdownLanguage,
                    codeLanguages: languages,
                  }),
                ]}
              />}
              
            </Space.LeftResizable>
          </Space.Fill>

          <Space.RightResizable
            size="50%"
            touchHandleSize={20}
            trackSize={true}
            scrollable={true}
          >
            <Space.Fill>
              <form onSubmit={handleSubmitNewApp}>
                <label>
                  application :
                  <input
                    type="text"
                    value={appTitle}
                    onChange={(e) => setAppName(appTitle)}
                    required
                  />
                </label>
                <input type="submit" value="Ajouter l'application " />
                {apps.length}
              </form>

              {oldApps.map((app, index) => (
                <iframe
                  key={index}
                  className={`w-full `}
                  style={{ height: (1 / (oldApps.length + 1)) * 100 + "%" }}
                  aria-label={`Code preview for ${app}`}
                  sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                  srcDoc={`<html><style>${app.cssCode}</style><body><h1>${app.appTitle}</h1>${app.htmlCode}<script type="module">${app.visibleJsCode}</script><pre class="fixed opacity-50 bottom-12 w-full bg-black text-white" id="logs"></pre><script>${consoleLog}</script></body></html>`}
                />
              ))}
              <h1>{appTitle}</h1>
              <iframe
                key="abscodlkjehslij"
                className={`w-full `}
                style={{ height: (1 / (oldApps.length + 1)) * 100 + "%" }}
                aria-label={`Code preview for`}
                sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                srcDoc={
                  jsCode === ""
                    ? ""
                    : `<html><style>${cssCode}</style><body>${htmlCode}<script type="module">${jsCode}</script><div class="fixed bottom-0"><pre class="fixed opacity-50 bottom-12 w-full bg-black text-white" id="logs"></pre></div><script>${consoleLog}</script></body></html>`
                }
              />
            </Space.Fill>
          </Space.RightResizable>
        </Space.ViewPort>
      </div>
    </HtmlCodeContext.Provider>
  );
}
