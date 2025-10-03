import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
import {
  Code2,
  TestTube,
  Zap,
  User,
  CheckCircle,
  Loader2,
  Settings,
  Maximize,
  Minimize,
  ChevronDown,
} from 'lucide-react';
import type { Challenge } from '@/types';
import { getLanguageDisplayName } from '@/utils/starterCodes';
import {
  defineZLanguage,
  defineZLanguageCompletionProvider,
} from '@/utils/zLanguageDefinition';
import {
  defineAllThemes,
  getAvailableThemes,
} from '@/utils/editorThemes';

interface CodeEditorPanelProps {
  challenge: Challenge;
  selectedLanguage: string;
  code: string;
  setCode: (code: string) => void;
  handleLanguageChange: (language: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  showMinimap: boolean;
  setShowMinimap: (show: boolean) => void;
  editorTheme: string;
  setEditorTheme: (theme: string) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  handleEditorDidMount: OnMount;
  testing: boolean;
  submitting: boolean;
  handleTestCode: () => void;
  handleSubmit: () => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  challenge,
  selectedLanguage,
  code,
  setCode,
  handleLanguageChange,
  fontSize,
  setFontSize,
  showMinimap,
  setShowMinimap,
  editorTheme,
  setEditorTheme,
  isFullscreen,
  setIsFullscreen,
  handleEditorDidMount,
  testing,
  submitting,
  handleTestCode,
  handleSubmit,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Enhanced editor mount handler with Z-- language support
  const handleEditorMount: OnMount = (editor, monaco) => {
    // Define all themes first
    defineAllThemes(monaco);

    // Define Z-- language if not already defined
    const languages = monaco.languages.getLanguages();
    const hasZLanguage = languages.some(lang => lang.id === 'z--');

    if (!hasZLanguage) {
      defineZLanguage(monaco);
      defineZLanguageCompletionProvider(monaco);
    }

    // Set the current theme
    monaco.editor.setTheme(editorTheme);

    // Call the original handler
    handleEditorDidMount(editor, monaco);
  };

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSettings]);

  const availableThemes = getAvailableThemes();

  return (
    <div
      className={`${
        isFullscreen ? 'w-full' : 'w-1/2'
      } bg-gray-900/30 backdrop-blur-sm flex flex-col`}
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-900/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-bold text-white">Code Editor</h2>
          </div>
          <div className="w-px h-6 bg-gray-700"></div>
          <select
            value={selectedLanguage}
            onChange={e => handleLanguageChange(e.target.value)}
            className="bg-gray-800/80 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-400 focus:outline-none hover:bg-gray-800 transition-colors"
          >
            {(
              challenge.metadata.supportedLanguages || [
                'z--',
                'javascript',
                'typescript',
                'python',
                'java',
                'cpp',
                'c',
              ]
            ).map(lang => (
              <option key={lang} value={lang}>
                {getLanguageDisplayName(lang)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors ${
                showSettings
                  ? 'bg-yellow-400/20 text-yellow-400'
                  : 'bg-gray-700/50 text-gray-400 hover:text-white'
              }`}
              title="Editor Settings"
            >
              <Settings className="w-4 h-4" />
              <ChevronDown
                className={`w-3 h-3 transition-transform ${showSettings ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl z-50">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white mb-4">
                    Editor Settings
                  </h3>

                  {/* Desktop: 2-column layout, Mobile: 1-column */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Font Size */}
                    <div className="space-y-2">
                      <label className="block text-xs text-gray-300">
                        Font Size
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setFontSize(Math.max(10, fontSize - 2))
                          }
                          className="px-2 py-1 bg-gray-700/50 text-gray-400 hover:text-white rounded text-xs transition-colors"
                        >
                          -
                        </button>
                        <span className="text-xs text-white min-w-[3rem] text-center bg-gray-800/50 px-2 py-1 rounded">
                          {fontSize}px
                        </span>
                        <button
                          onClick={() =>
                            setFontSize(Math.min(24, fontSize + 2))
                          }
                          className="px-2 py-1 bg-gray-700/50 text-gray-400 hover:text-white rounded text-xs transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Minimap */}
                    <div className="space-y-2">
                      <label className="block text-xs text-gray-300">
                        Minimap
                      </label>
                      <button
                        onClick={() => setShowMinimap(!showMinimap)}
                        className={`w-full px-3 py-1 rounded text-xs font-medium transition-colors ${
                          showMinimap
                            ? 'bg-yellow-400/20 text-yellow-400'
                            : 'bg-gray-700/50 text-gray-400 hover:text-white'
                        }`}
                      >
                        {showMinimap ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    {/* Theme Selection */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-xs text-gray-300">
                        Editor Theme
                      </label>
                      <select
                        value={editorTheme}
                        onChange={e => setEditorTheme(e.target.value)}
                        className="w-full bg-gray-800/80 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-xs focus:border-yellow-400 focus:outline-none hover:bg-gray-800 transition-colors"
                      >
                        {availableThemes.map(theme => (
                          <option key={theme.id} value={theme.id}>
                            {theme.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-gray-700/50 text-gray-400 hover:text-white rounded-lg text-xs font-medium transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={selectedLanguage}
          value={code}
          onChange={(value: string | undefined) => setCode(value || '')}
          onMount={handleEditorMount}
          theme={editorTheme}
          options={{
            fontSize: fontSize,
            fontFamily:
              "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
            fontLigatures: true,
            minimap: { enabled: showMinimap },
            wordWrap: 'on',
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderLineHighlight: 'line',
            cursorStyle: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            contextmenu: true,
            selectOnLineNumbers: true,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            padding: { top: 16, bottom: 16 },
          }}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-3 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading editor...</span>
              </div>
            </div>
          }
        />
      </div>

      {/* Action Bar */}
      <div className="border-t border-gray-700/50 bg-gray-900/90 backdrop-blur-sm p-3">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
          {/* Stats Section */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 text-sm text-gray-400 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  {challenge.stats?.totalSubmissions || 0} submissions
                </span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="truncate">
                  {Math.round(
                    ((challenge.stats?.successfulSubmissions || 0) /
                      Math.max(challenge.stats?.totalSubmissions || 1, 1)) *
                      100
                  )}
                  % success
                </span>
              </div>
            </div>
            <div className="hidden md:block w-px h-4 bg-gray-600 flex-shrink-0"></div>
            <div className="text-xs text-gray-500 font-mono bg-gray-800/50 px-2 py-1 rounded-md whitespace-nowrap">
              Ctrl+Enter to test
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleTestCode}
              disabled={testing || !code.trim()}
              className="flex items-center gap-2 bg-blue-600/90 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 whitespace-nowrap"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  <span className="hidden sm:inline">Testing...</span>
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Test</span>
                </>
              )}
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting || !code.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-yellow-400/25 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 whitespace-nowrap"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  <span className="hidden sm:inline">Submitting...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Submit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
