import React from 'react';
import MonacoEditor from 'react-monaco-editor';

export default function CodeEditor(props) {
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

    function editorDidMount(editor, monaco) {
        console.log('editorDidMount', editor);
        editor.focus();
    }

    function onChange(newValue, e) {
        console.log('onChange', newValue, e);
    }

    return (
        <MonacoEditor
            width="800"
            height="600"
            language="js"
            theme="vs-dark"
            value={props.code}
            options={options}
            onChange={props.change}
            editorDidMount={editorDidMount}
        />
    );
}