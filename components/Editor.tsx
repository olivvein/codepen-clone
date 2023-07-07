"use client";

import { SetStateAction, useState } from "react";

export default function Editor() {
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");

  const handleHtmlChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setHtmlCode(event.target.value);
  };

  const handleCssChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setCssCode(event.target.value);
  };

  const handleJsChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setJsCode(event.target.value);
  };

  return (
    <div className="flex flex-col justify-center gap-8 items-center">
      <div className="flex flex-row justify-center gap-8 items-center">
        <div>
          <textarea
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            value={htmlCode}
            onChange={handleHtmlChange}
            placeholder="HTML"
          />
        </div>
        <div>
          <textarea
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            value={cssCode}
            onChange={handleCssChange}
            placeholder="CSS"
          />
        </div>
        <div>
          <textarea
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            value={jsCode}
            onChange={handleJsChange}
            placeholder="JavaScript"
          />
        </div>
      </div>
      <div>
        <iframe
          className="w-screen min-h-[50vh] fixed bottom-0 left-0 max-md:mb-10"
          aria-label="Code preview"
          srcDoc={`<html><style>${cssCode}</style><body>${htmlCode}<script>${jsCode}</script></body></html>`}
        />
      </div>
    </div>
  );
}
