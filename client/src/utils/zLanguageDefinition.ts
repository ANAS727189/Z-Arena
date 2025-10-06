// Define Z-- language configuration and syntax highlighting
export const defineZLanguage = (monaco: any) => {
  // Register the Z-- language
  monaco.languages.register({ id: 'z--' });

  // Configure language properties
  monaco.languages.setLanguageConfiguration('z--', {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  });

  // Define syntax highlighting for Z-- language using the same approach as main Z Studio
  monaco.languages.setMonarchTokensProvider('z--', {
    tokenizer: {
      root: [
        // Keywords
        [
          /(start|end|function|if|else|while|for|return|var|let|const|main|print|input|true|false|null|int|float|string|bool|void)/,
          'keyword',
        ],

        // Comments
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string'],
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/'/, 'string', '@stringSingle'],

        // Numbers
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/\d+/, 'number'],

        // Identifiers
        [/[a-zA-Z_$][\w$]*/, 'identifier'],

        // Operators
        [/[=><!~?:&|+\-*\/\^%]+/, 'operator'],

        // Brackets and delimiters
        [/[{}()\[\]]/, 'delimiter.bracket'],
        [/[;,.]/, 'delimiter'],

        // Whitespace
        [/[ \t\r\n]+/, 'white'],
      ],

      comment: [
        [/[^\/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment'],
      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop'],
      ],

      stringSingle: [
        [/[^\\']+/, 'string'],
        [/\\./, 'string.escape'],
        [/'/, 'string', '@pop'],
      ],
    },
  });

  // Define the theme for Z-- language
  monaco.editor.defineTheme('z--dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment.z--', foreground: '6A9955' },
      { token: 'keyword.z--', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'identifier.z--', foreground: '9CDCFE' },
      { token: 'number.z--', foreground: 'B5CEA8' },
      { token: 'string.z--', foreground: 'CE9178' },
      { token: 'operator.z--', foreground: 'D4D4D4' },
      { token: 'delimiter.z--', foreground: 'D4D4D4' },
    ],
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editorCursor.foreground': '#aeafad',
      'editor.lineHighlightBackground': '#2d2d30',
      'editorLineNumber.foreground': '#858585',
      'editor.selectionBackground': '#264f78',
      'editor.inactiveSelectionBackground': '#3a3d41',
    },
  });
};

// Language completion provider for Z--
export const defineZLanguageCompletionProvider = (monaco: any) => {
  monaco.languages.registerCompletionItemProvider('z--', {
    provideCompletionItems: (_model: any, _position: any) => {
      const suggestions = [
        {
          label: 'function',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'function',
          documentation: 'Define a function',
        },
        {
          label: 'if',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'if',
          documentation: 'If statement',
        },
        {
          label: 'else',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'else',
          documentation: 'Else statement',
        },
        {
          label: 'while',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'while',
          documentation: 'While loop',
        },
        {
          label: 'for',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'for',
          documentation: 'For loop',
        },
        {
          label: 'return',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'return',
          documentation: 'Return statement',
        },
        {
          label: 'var',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'var',
          documentation: 'Variable declaration',
        },
        {
          label: 'let',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'let',
          documentation: 'Let declaration',
        },
        {
          label: 'const',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'const',
          documentation: 'Constant declaration',
        },
        {
          label: 'main',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'main',
          documentation: 'Main function',
        },
        {
          label: 'print',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'print',
          documentation: 'Print function',
        },
        {
          label: 'input',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'input',
          documentation: 'Input function',
        },
      ];
      return { suggestions };
    },
  });
};

// Hover provider for Z--
export const defineZLanguageHoverProvider = (monaco: any) => {
  monaco.languages.registerHoverProvider('z--', {
    provideHover: (model: any, position: any) => {
      const word = model.getWordAtPosition(position);
      if (!word) return;

      const hoverMap: { [key: string]: string } = {
        function: 'Defines a function in Z--',
        if: 'Conditional statement',
        else: 'Alternative branch for if statement',
        while: 'Loop that continues while condition is true',
        for: 'Loop with initialization, condition, and increment',
        return: 'Returns a value from a function',
        var: 'Declares a variable',
        let: 'Declares a block-scoped variable',
        const: 'Declares a constant',
        main: 'Entry point of the program',
        print: 'Outputs text to console',
        input: 'Reads input from user',
        true: 'Boolean true value',
        false: 'Boolean false value',
        null: 'Null value',
        int: 'Integer data type',
        float: 'Floating-point data type',
        string: 'String data type',
        bool: 'Boolean data type',
        void: 'Void return type',
      };

      const hover = hoverMap[word.word];
      if (hover) {
        return {
          range: new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          ),
          contents: [{ value: hover }],
        };
      }
    },
  });
};
