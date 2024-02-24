import { createContext } from 'react';

//export const HtmlCodeContext = createContext({ htmlCode: "", setHtmlCode: () => {} });
export const HtmlCodeContext = createContext<{ appTitle:string,setAppTitle:React.Dispatch<React.SetStateAction<string>>,htmlCode: string, setHtmlCode: React.Dispatch<React.SetStateAction<string>> ,jsCode: string, setJsCode: React.Dispatch<React.SetStateAction<string>>,visibleJsCode: string, setVisibleJsCode: React.Dispatch<React.SetStateAction<string>> ,cssCode: string, setCssCode: React.Dispatch<React.SetStateAction<string>> }>({ appTitle:"", setAppTitle:()=>{},htmlCode: "", setHtmlCode: () => {} ,jsCode: "", setJsCode: () => {},visibleJsCode: "", setVisibleJsCode: () => {}  ,cssCode: "", setCssCode: () => {} });
