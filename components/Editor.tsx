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
    <div>
      <div>
        <textarea
          value={htmlCode}
          onChange={handleHtmlChange}
          placeholder="HTML"
        />
      </div>
      <div>
        <textarea
          value={cssCode}
          onChange={handleCssChange}
          placeholder="CSS"
        />
      </div>
      <div>
        <textarea
          value={jsCode}
          onChange={handleJsChange}
          placeholder="JavaScript"
        />
      </div>
      <div>
        <iframe
          aria-label="Code preview"
          srcDoc={`<html><style>${cssCode}</style><body>${htmlCode}<script>${jsCode}</script></body></html>`}
        />
      </div>
    </div>
  );
}
