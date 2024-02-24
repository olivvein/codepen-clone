"use client";

import { SetStateAction, use, useContext, useEffect, useState } from "react";
import * as Space from "react-spaces";
import { HtmlCodeContext } from "@/components/Context";
import Chat from "./Chat";
import * as Babel from "@babel/standalone";
import CodeEditor from "./CodeEditor";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { langs } from "@uiw/codemirror-extensions-langs";
import { WavyBackground } from "@/components/ui/wavy-background";
import axios from 'axios';


export default function Editor() {
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");

  const [appTitle, setAppTitle] = useState("");

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
  const response = await axios.post('/api/saveApp', {
    htmlCode,
    cssCode,
    visibleJsCode,
    appTitle
  });
  console.log('Saved', response.data.id);
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

  const downloadCode = () => {
    const code = saveFullCode(htmlCode, cssCode, jsCode);
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "index.html";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  function transpileJSX(jsxCode: string) {
    return Babel.transform(jsxCode, {
      presets: ["react"],
    }).code;
  }

  const onChange2 = (newValue, e) => {
    console.log("new Js Code : ");
    //setJsCode(newValue);
  };

  const handleHtmlChange2 = (newValue, e) => {
    console.log("new Js Code : ");
    setHtmlCode(newValue);
  };

  const extractCodeSnippetInMarkdown = (str: string) => {
    return str.match(/```([\s\S]*)```/)?.[1] || "";
  };

  const detectLanguage = (str: string) => {
    return str.match(/```html|```css|```js/)?.[0].replace("```", "") || "";
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
    return str.replace("```js", "```");
  };

  const removeCSSTags = (str: string) => {
    return str.replace("```css", "```");
  };

  const consoleLog = `var oldLog = console.log;
  var logElement = document.getElementById('logs');

  console.log = function (message) {
      if (typeof message == 'object') {
          logElement.innerHTML += message + '<br />';
      } else {
          logElement.innerHTML += message + '<br />';
      }
      oldLog.apply(console, arguments);
  };
  console.error=console.log;`;

  useEffect(() => {
    let newHtmlCode = htmlCode;
    console.log("newHtmlCode");
    console.log(newHtmlCode);
    newHtmlCode = removeHTMLTags(newHtmlCode);
    console.log(newHtmlCode);
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

  useEffect(() => {
    let newJsCode = jsCode;
    console.log("newJsCode");
    console.log(newJsCode);
    newJsCode = removeJSTags(newJsCode);
    console.log(newJsCode);
    newJsCode = removeMarkDownCodeTags(newJsCode);
    setHtmlCode(removeHTMLTags(htmlCode));
    try {
      newJsCode = transpileJSX(newJsCode);
    } catch (error) {
      console.log("error on Transpile");
      console.log(error);
      //alert(error);
    }

    setJsCode(newJsCode);
  }, [jsCode]);

  useEffect(() => {
    let newJsCode = removeBodyTags(visibleJsCode);
    console.log("newJsCode");
    console.log(newJsCode);
    newJsCode = removeJSTags(newJsCode);
    console.log(newJsCode);
    newJsCode = removeMarkDownCodeTags(newJsCode);

    setVisibleJsCode(newJsCode);
  }, [visibleJsCode]);

  useEffect(() => {
    let newHtmlCode = cssCode;
    newHtmlCode = removeCSSTags(newHtmlCode);
    newHtmlCode = removeMarkDownCodeTags(newHtmlCode);

    setCssCode(newHtmlCode);
  }, [cssCode]);

  const handleHtmlChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    const strVal = event.target.value.toString();
    setHtmlCode(strVal);
  };

  const handleCssChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setCssCode(event.target.value);
  };

  const handleJsChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    console.log("Js Change");
    setJsCode(event.target.value);
    setVisibleJsCode(event.target.value);
  };

  const handleJsChange2 = (code: string) => {
    console.log("Js Change");
    setJsCode(code);
    setVisibleJsCode(code);
  };

  return (
    <HtmlCodeContext.Provider
      value={{
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
        <WavyBackground />
        
        <Space.ViewPort top={80} className="w-full">
          <Space.Fill trackSize={true}>
            <Space.LeftResizable
              size="50%"
              touchHandleSize={20}
              trackSize={true}
              scrollable={true}
              className="border border-gray-500 opacity-90 bg-gray-800"
            >
              <span className="leading-relaxed h-2 bg-slate-200/10 w-full  sticky  rounded-md dark:bg-slate-900/10 text-slate-900 dark:text-white">
                HTML
              </span>
              {/* <textarea
                className="resize-none bg-slate-200/50 w-full h-full  dark:bg-slate-900 text-slate-900 dark:text-white"
                value={htmlCode}
                onChange={handleHtmlChange}
                placeholder="<H1>Hi there</H1>"
              /> */}
              {/* <CodeEditor code={htmlCode} language="html" change={handleHtmlChange2} />  */}
              <CodeMirror
                onChange={handleHtmlChange2}
                value={htmlCode}
                theme={vscodeDark}
                lang="html"
                extensions={[javascript({ jsx: true })]}
              />
            </Space.LeftResizable>

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

            <Space.RightResizable
              size="50%"
              touchHandleSize={20}
              trackSize={true}
              scrollable={true}
              className="border border-gray-500 opacity-90 bg-gray-800"
            >
              <div className="flex items-center">
                <select
                  value={selectedLanguage}
                  onChange={OnLanguageChange}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-auto px-auto rounded inline-flex items-center"
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="Babel">Babel</option>
                </select>

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

              <CodeMirror
                onChange={onChange2}
                value={
                  selectedLanguage === "JavaScript" ? visibleJsCode : jsCode
                }
                theme={vscodeDark}
                lang="javascript"
                extensions={[langs.tsx(), langs.jsx()]}
              />
            </Space.RightResizable>
          </Space.Fill>

          <Space.BottomResizable
            size="50%"
            touchHandleSize={20}
            trackSize={true}
            scrollable={true}
          >
            <Space.Fill>
              <h1>{appTitle}</h1>
              <iframe
                className="w-full h-full"
                aria-label="Code preview"
                sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                srcDoc={`<html><style>${cssCode}</style><body>${htmlCode}<script type="module">${jsCode}</script><pre id="logs"></pre><script>${consoleLog}</script></body></html>`}
              />
            </Space.Fill>
          </Space.BottomResizable>
        </Space.ViewPort>
        <Chat />
      </div>
    </HtmlCodeContext.Provider>
  );
}
