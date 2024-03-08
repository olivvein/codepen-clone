import React from 'react';
import MonacoEditor, { ChangeHandler } from 'react-monaco-editor';

export default function CodeEditor(props: { code: string | null | undefined; change: ChangeHandler | undefined; }) {
    const options = {
        selectOnLineNumbers: true,
        renderIndentGuides: true,
        colorDecorators: true,
        cursorBlinking: "blink",
        autoClosingQuotes: "always",
        find: {
            autoFindInSelection: "always"
        },
        snippetSuggestions: "inline"
    };

    function editorDidMount(editor: { focus: () => void; }, monaco: any) {
        console.log('editorDidMount', editor);
        editor.focus();
    }

    function onChange(newValue: any, e: any) {
        console.log('onChange', newValue, e);
    }

    return (
        <MonacoEditor
            width="800"
            height="600"
            language="js"
            theme="vs-dark"
            value={props.code}
            onChange={props.change}
            editorDidMount={editorDidMount}
        />
    );
}