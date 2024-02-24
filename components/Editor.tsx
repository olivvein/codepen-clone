"use client";

import { SetStateAction, use, useContext, useEffect, useState } from "react";
import * as Space from "react-spaces";
import { HtmlCodeContext } from "@/components/Context";
import Chat from "./Chat";
import * as Babel from '@babel/standalone';
import CodeEditor from "./CodeEditor";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from '@codemirror/lang-javascript';
import { langs } from '@uiw/codemirror-extensions-langs';





export default function Editor() {



  const [htmlCode, setHtmlCode] = useState(`<div id="app" class="h-screen bg-gray-800 flex items-center justify-center">
  <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4">
    <h1 class="text-xl font-bold">Start Coding</h1>
  </div>
</div>`);

  function transpileJSX(jsxCode:string) {
    return Babel.transform(jsxCode, {
      presets: ['react']
    }).code;
  }

  const onChange2=(newValue, e) =>{
    console.log("new Js Code : ");
    setJsCode(newValue);
  }

  const handleHtmlChange2=(newValue, e) =>{
    console.log("new Js Code : ");
    setHtmlCode(newValue);
  }

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
  }

  const removeCSSTags  = (str: string) => {
    return str.replace("```css", "```");
  }


  useEffect(() => {
    let newHtmlCode =htmlCode;
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
    
    newJsCode=transpileJSX(newJsCode);
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
    let newHtmlCode = removeBodyTags(cssCode);
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

  const handleJsChange2 = (code:string) => {
    console.log("Js Change");
    setJsCode(code);
    setVisibleJsCode(code);
  };

  return (
    <HtmlCodeContext.Provider
      value={{ htmlCode, setHtmlCode, jsCode, setJsCode,visibleJsCode,setVisibleJsCode, cssCode, setCssCode }}
    >
      <div className="w-full">
        <Space.ViewPort top={80} className="w-full">
          <Space.Fill trackSize={true}>
            <Space.LeftResizable
              size="50%"
              touchHandleSize={20}
              trackSize={true}
              scrollable={true}
              className="border border-gray-500"
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
              <CodeMirror onChange={handleHtmlChange2} value={htmlCode}  theme={vscodeDark} lang="html" extensions={[javascript({ jsx: true })]}/>
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
              className="border border-gray-500"
            >
              <span className="leading-relaxed h-2  bg-slate-200/10 w-full  sticky  rounded-md dark:bg-slate-900/10 text-slate-900 dark:text-white">
                JavaScript
              </span>
              {/* <textarea
                className="resize-none bg-slate-200/50 w-full  h-full dark:bg-slate-900 text-slate-900 dark:text-white"
                value={visibleJsCode}
                onChange={handleJsChange}
                placeholder="JavaScript code here..."
              /> */}
             {/* <CodeEditor code={visibleJsCode} language="javascript" change={onChange2} />  */}
             <CodeMirror onChange={onChange2} value={visibleJsCode}  theme={vscodeDark} lang="javascript" extensions={[langs.tsx(),langs.jsx()]}/>

            </Space.RightResizable>
          </Space.Fill>

          <Space.BottomResizable
            size="50%"
            touchHandleSize={20}
            trackSize={true}
            scrollable={true}
          >
            <Space.Fill>
              <iframe
                className="w-full h-full"
                aria-label="Code preview"
                sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                srcDoc={`<html><style>${cssCode}</style><body>${htmlCode}<script type="module">${jsCode}</script></body></html>`}
              />
            </Space.Fill>
          </Space.BottomResizable>
        </Space.ViewPort>
        <Chat />
      </div>
    </HtmlCodeContext.Provider>
  );
}
