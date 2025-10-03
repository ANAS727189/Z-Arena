// Editor themes configuration similar to Z Studio
export interface EditorTheme {
  id: string;
  name: string;
  base: 'vs' | 'vs-dark' | 'hc-black';
  inherit: boolean;
  rules: Array<{
    token: string;
    foreground?: string;
    background?: string;
    fontStyle?: string;
  }>;
  colors: Record<string, string>;
}

export const editorThemes: Record<string, EditorTheme> = {
  'vs-dark': {
    id: 'vs-dark',
    name: 'Dark (Default)',
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {},
  },

  'z-studio-dark': {
    id: 'z-studio-dark',
    name: 'Z Studio Dark',
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'identifier', foreground: '9CDCFE' },
      { token: 'type.identifier', foreground: '4EC9B0' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'number.float', foreground: 'B5CEA8' },
      { token: 'number.hex', foreground: 'B5CEA8' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'string.escape', foreground: 'D7BA7D' },
      { token: 'operator', foreground: 'D4D4D4' },
      { token: 'delimiter', foreground: 'D4D4D4' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#e6edf3',
      'editorCursor.foreground': '#f0f6fc',
      'editor.lineHighlightBackground': '#21262d',
      'editorLineNumber.foreground': '#7d8590',
      'editor.selectionBackground': '#264f78',
      'editor.inactiveSelectionBackground': '#264f7880',
    },
  },

  'github-dark': {
    id: 'github-dark',
    name: 'GitHub Dark',
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff7b72', fontStyle: 'bold' },
      { token: 'identifier', foreground: 'e6edf3' },
      { token: 'type.identifier', foreground: '7ee787' },
      { token: 'number', foreground: '79c0ff' },
      { token: 'string', foreground: 'a5d6ff' },
      { token: 'operator', foreground: 'e6edf3' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#e6edf3',
      'editorCursor.foreground': '#f0f6fc',
      'editor.lineHighlightBackground': '#21262d',
      'editorLineNumber.foreground': '#7d8590',
    },
  },

  monokai: {
    id: 'monokai',
    name: 'Monokai',
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '75715e', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'f92672', fontStyle: 'bold' },
      { token: 'identifier', foreground: 'f8f8f2' },
      { token: 'type.identifier', foreground: '66d9ef' },
      { token: 'number', foreground: 'ae81ff' },
      { token: 'string', foreground: 'e6db74' },
      { token: 'operator', foreground: 'f92672' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#f8f8f2',
      'editorCursor.foreground': '#f8f8f0',
      'editor.lineHighlightBackground': '#3e3d32',
      'editorLineNumber.foreground': '#90908a',
    },
  },

  dracula: {
    id: 'dracula',
    name: 'Dracula',
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },
      { token: 'identifier', foreground: 'f8f8f2' },
      { token: 'type.identifier', foreground: '8be9fd' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'operator', foreground: 'ff79c6' },
    ],
    colors: {
      'editor.background': '#282a36',
      'editor.foreground': '#f8f8f2',
      'editorCursor.foreground': '#f8f8f0',
      'editor.lineHighlightBackground': '#44475a',
      'editorLineNumber.foreground': '#6272a4',
    },
  },

  'vs-light': {
    id: 'vs-light',
    name: 'Light (Default)',
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {},
  },

  'github-light': {
    id: 'github-light',
    name: 'GitHub Light',
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6e7781', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'cf222e', fontStyle: 'bold' },
      { token: 'identifier', foreground: '24292f' },
      { token: 'type.identifier', foreground: '116329' },
      { token: 'number', foreground: '0550ae' },
      { token: 'string', foreground: '0a3069' },
      { token: 'operator', foreground: '24292f' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#24292f',
      'editorCursor.foreground': '#24292f',
      'editor.lineHighlightBackground': '#f6f8fa',
      'editorLineNumber.foreground': '#656d76',
    },
  },

  'solarized-dark': {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '586e75', fontStyle: 'italic' },
      { token: 'keyword', foreground: '859900', fontStyle: 'bold' },
      { token: 'identifier', foreground: '93a1a1' },
      { token: 'type.identifier', foreground: '268bd2' },
      { token: 'number', foreground: 'd33682' },
      { token: 'string', foreground: '2aa198' },
      { token: 'operator', foreground: '93a1a1' },
    ],
    colors: {
      'editor.background': '#002b36',
      'editor.foreground': '#93a1a1',
      'editorCursor.foreground': '#93a1a1',
      'editor.lineHighlightBackground': '#073642',
      'editorLineNumber.foreground': '#586e75',
    },
  },

  'night-owl': {
    id: 'night-owl',
    name: 'Night Owl',
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '637777', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c792ea', fontStyle: 'bold' },
      { token: 'identifier', foreground: 'd6deeb' },
      { token: 'type.identifier', foreground: '82aaff' },
      { token: 'number', foreground: 'f78c6c' },
      { token: 'string', foreground: 'ecc48d' },
      { token: 'operator', foreground: 'd6deeb' },
    ],
    colors: {
      'editor.background': '#011627',
      'editor.foreground': '#d6deeb',
      'editorCursor.foreground': '#d6deeb',
      'editor.lineHighlightBackground': '#1d3b53',
      'editorLineNumber.foreground': '#4b6479',
    },
  },
};

// Function to define all themes in Monaco
export const defineAllThemes = (monaco: any) => {
  Object.values(editorThemes).forEach(theme => {
    if (theme.id !== 'vs-dark' && theme.id !== 'vs-light') {
      monaco.editor.defineTheme(theme.id, theme);
    }
  });
};

// Get theme display name
export const getThemeDisplayName = (themeId: string): string => {
  return editorThemes[themeId]?.name || themeId;
};

// Get available themes
export const getAvailableThemes = (): Array<{ id: string; name: string }> => {
  return Object.values(editorThemes).map(theme => ({
    id: theme.id,
    name: theme.name,
  }));
};
