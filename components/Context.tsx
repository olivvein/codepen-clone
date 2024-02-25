import { createContext } from "react";

interface Message {
  role: string;
  content: string;
}


export const HtmlCodeContext = createContext<{
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
}>({
  fullMessages: [], // Updated initial value
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
});





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

export const HtmlCodesContext = createContext<HtmlCodeContextType[]>([]);