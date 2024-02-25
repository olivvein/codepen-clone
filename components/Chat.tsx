"use client";

import { useChat } from "ai/react";
import { ChangeEvent, use, useState, useContext, useEffect } from "react";
import Editor from "@/components/Editor";
import { HtmlCodeContext } from "@/components/Context";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const {
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
  } = useContext(HtmlCodeContext);

  const handleSubmitInput = (e: any) => {
    handleSubmit(e);
    setJsCode("");
  };

  const [timeOfTitle, setTimeOfTitle] = useState(0);

  const editor = Editor();

  const [title, setTitle] = useState("Chat");

  const getConversationTitle = (messages: any[]) => {
    const allMessages = [...messages];
    allMessages.forEach((m) => {
      try {
        delete m.id;
      } catch (error) {
        console.log(error);
      }
      try {
        delete m.createdAt;
      } catch (error) {
        console.log(error);
      }
    });
    if (allMessages.length === 0) {
      return "Chat";
    }
    allMessages[0].content =
      "You give this app a title based on the conversation";
    allMessages.push({
      role: "user",
      content: "Give this app a title. Just reply the title.",
    });
    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: allMessages }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAppTitle(data);
        setTimeOfTitle(Date.now());
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return allMessages[allMessages.length - 1].content;
  };

  const handle2 = (
    data: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    handleInputChange(data);
  };

  const extractMultipleCodeSnippetInMarkdown = (str: string) => {
    return str.match(/```([\s\S]*?)```/g) || [];
  };

  const extractNonCodeParts = (str: string) => {
    const regex = /```[\s\S]*?```/g;
    return str.split(regex);
  };

  const detectLanguage = (str: string) => {
    str = str.replace(/```javascript/g, "```js");
    return str.match(/html|css|js/)?.[0].replace("```", "") || "";
  };

  const systemPrompt = `You only create HTML,JS and CSS code. 
The HTML will be is inside <BODY> tag.
You write in md format. you only write good code.
You will create each snippet separately for each language. 
You only provide code snippets. no explaination, no title, no comment. 
You use Tailwind and react.js
Allways separate the html, css and js in separate code snippets.
add theses imports to your js script :
import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";

if you want to import a package, you can use a cdn like https://esm.sh/ 

import { setup as twindSetup } from 'https://cdn.skypack.dev/twind/shim'
allways make the app take 100% of available space, with dark background. 
Use card and beautiful tailwind style to present the result.
Allways use try catch to handle errors.
  `;

  useEffect(() => {
    messages.push({
      role: "system",
      content: systemPrompt,
      id: "0",
    });
    setHtmlCode("<H1>Hi there 8</H1>");
  }, []);

  //For each new message I want to add the message.content to Editor htmlCode

  const extractLastCodeSnippetFromMdNotClosed = (str: string) => {
    //There is multiple code snippet in the message.
    //I want to extract the last one that is not closed and the language of the snippet
    let result = { snippet: "", language: "" };
    const regex = /```(\w+)?([\s\S]*?)(```)?/g;
    let match;
    let matches = [];
    while ((match = regex.exec(str)) !== null) {
      matches.push(match);
    }
    console.log(matches);
    for (let i = matches.length - 1; i >= 0; i--) {
      if (!matches[i][3]) {
        // if the code snippet is not closed
        result.snippet = matches[i][2].trim();
        result.language = matches[i][1] || "";
        break;
      }
    }
    return result;
  };

  useEffect(() => {
    //console.log(messages);
    if (messages.length > 2) {
      const newMessage = messages[messages.length - 1];
      //send the message to the editor to the right language
      console.log("newMessage");
      console.log(newMessage.content);
      const newwMessage = {
        role: newMessage.role,
        content: newMessage.content,
      };
      // push the message to the fullMessages
      setFullMessages((prev) => [...prev, newwMessage]);

      const snippets = extractMultipleCodeSnippetInMarkdown(newMessage.content);
      for (let i = 0; i < snippets.length; i++) {
        const language = detectLanguage(snippets[i]);

        if (language === "html") {
          snippets[i] = snippets[i].replace("```html", "```");
          snippets[i] = snippets[i].replace("```", "");
          snippets[i] = snippets[i].replace("```", "");
          setHtmlCode(snippets[i]);
        }
        if (language === "css") {
          snippets[i] = snippets[i].replace("```css", "```");
          snippets[i] = snippets[i].replace("```", "");
          setCssCode(snippets[i]);
        }
        if (language === "js") {
          snippets[i] = snippets[i].replace("```js", "```");
          snippets[i] = snippets[i].replace("```javascript", "```");
          snippets[i] = snippets[i].replace("```", "");
          setJsCode(snippets[i]);
          setVisibleJsCode(snippets[i]);
          //if time of title is less than 5 minutes, I want to change the title
          const elapsed = Date.now() - timeOfTitle;
          console.log("elapsed");
          console.log(elapsed);

          if (elapsed > 5 * 1000) {
            console.log("getConversationTitle(messages)");
            getConversationTitle(messages);
          }
        }
      }

      const liveSnippet = extractNonCodeParts(newMessage.content);
      if (liveSnippet) {
        console.log("liveSnippet");
        console.log(liveSnippet);
        let liveSnippetString = liveSnippet.join("");
        if (
          liveSnippetString &&
          (liveSnippetString.indexOf("```js") !== -1 ||
            liveSnippetString.indexOf("```javascript") !== -1)
        ) {
          liveSnippetString = liveSnippetString.replace("javascript", "js");
          liveSnippetString = liveSnippetString.replace("```js", "");
          liveSnippetString = liveSnippetString.replace("```javascript", "");
          liveSnippetString = liveSnippetString.replace("```", "");
          //remove the first blank lines
          liveSnippetString = liveSnippetString.replace(/^\s*\n/gm, "");
          setVisibleJsCode(liveSnippetString);
        }
      }
    }
  }, [messages]);
  return (
    <div className="absolute left-0 top-0 flex flex-col w-full max-w-md py-24 mx-auto stretch items-center justify-center">
      <form onSubmit={handleSubmitInput}>
        <input
          className="absolute  left-1/2 top-0  w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl z-50"
          value={input}
          placeholder="What do you want?"
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
