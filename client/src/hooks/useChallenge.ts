import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { OnMount } from '@monaco-editor/react';
import { challengeService } from '@/services/challengeService';
import { useAuth } from '@/hooks/useAuth';
import type { Challenge } from '@/types';
import { getStarterCode } from '@/utils/starterCodes';

export const useChallenge = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Challenge data
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  // Code editor state
  const [selectedLanguage, setSelectedLanguage] = useState<string>('z--');
  const [code, setCode] = useState<string>(getStarterCode('z--'));
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);

  // UI State
  const [activeTab, setActiveTab] = useState<
    'description' | 'editorial' | 'submissions'
  >('description');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showMinimap, setShowMinimap] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    examples: true,
    constraints: false,
    hints: false,
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Editor refs
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (id) {
      loadChallenge(id);
    }
  }, [id]);

  const loadChallenge = async (challengeId: string) => {
    try {
      const challengeData = await challengeService.getChallenge(challengeId);
      if (challengeData) {
        setChallenge(challengeData);
        // Set default language and starter code
        const firstLang =
          challengeData.metadata.supportedLanguages?.[0] || 'z--';
        setSelectedLanguage(firstLang);

        // Try to get starter code with priority order:
        // 1. Challenge-specific language starter code
        // 2. Challenge general starter code
        // 3. Default language starter code template
        let starterCode = '';
        if (challengeData.languages && challengeData.languages[firstLang]) {
          starterCode = challengeData.languages[firstLang].starterCode || '';
        } else if (challengeData.code?.starterCode) {
          starterCode = challengeData.code.starterCode;
        } else {
          // Use default starter code template for the language
          starterCode = getStarterCode(
            firstLang,
            challengeData.metadata?.title
          );
        }
        setCode(starterCode);
      }
    } catch (error) {
      console.error('Error loading challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);

    // Get appropriate starter code with priority order:
    // 1. Challenge-specific language starter code
    // 2. Challenge general starter code
    // 3. Default language starter code template
    if (challenge?.languages && challenge.languages[language]) {
      setCode(challenge.languages[language].starterCode);
    } else if (challenge?.code?.starterCode) {
      setCode(challenge.code.starterCode);
    } else {
      // Use default starter code template for the language
      const starterCode = getStarterCode(language, challenge?.metadata?.title);
      setCode(starterCode);
    }
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure editor
    editor.updateOptions({
      fontSize: fontSize,
      minimap: { enabled: showMinimap },
      wordWrap: 'on',
      lineNumbers: 'on',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderLineHighlight: 'line',
      cursorStyle: 'line',
      cursorBlinking: 'smooth',
    });

    // Add custom commands
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleTestCode();
    });
  };

  const toggleSection = (section: 'examples' | 'constraints' | 'hints') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleTestCode = async () => {
    if (!challenge) {
      alert('Challenge not loaded. Please refresh the page.');
      return;
    }

    if (!challenge.id) {
      alert('Challenge ID is missing. Please refresh the page.');
      return;
    }

    if (!code.trim()) {
      alert('Please write some code before testing!');
      return;
    }

    setTesting(true);
    try {
      const result = await challengeService.executeCode({
        code,
        language: selectedLanguage,
        testCases: challenge.testCases.slice(0, 3), // Test only first 3 cases for preview
        timeLimit: challenge.metadata.timeLimit * 60 * 1000,
      });

      const passedTests = result.testResults.filter(r => r.passed).length;
      const totalTests = result.testResults.length;

      if (result.success) {
        const details = result.testResults
          .map(
            (test, i) =>
              `Test ${i + 1}: ${test.passed ? '✅ Passed' : '❌ Failed'} (${test.executionTime}ms)`
          )
          .join('\n');

        alert(
          `🧪 Test Results:\n${details}\n\nPassed: ${passedTests}/${totalTests} tests\nScore: ${result.totalScore} points`
        );
      } else {
        alert(`❌ Test failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to test code:', error);
      alert('Failed to test code. Please check your syntax and try again.');
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!challenge) {
      alert('Challenge not loaded. Please refresh the page.');
      return;
    }

    if (!challenge.id) {
      alert('Challenge ID is missing. Please refresh the page.');
      return;
    }

    if (!code.trim()) {
      alert('Please write some code before submitting!');
      return;
    }

    setSubmitting(true);
    try {
      const submission = await challengeService.submitSolution(
        challenge.id,
        user.$id,
        code,
        selectedLanguage
      );

      if (submission.status === 'success') {
        const passedTests = submission.testResults.filter(
          (r: any) => r.passed
        ).length;
        const totalTests = submission.testResults.length;

        if (passedTests === totalTests) {
          alert(
            `🎉 Congratulations!\n\nAll tests passed!\nScore: ${submission.score} points`
          );
        } else {
          const details = submission.testResults
            .map(
              (test: any, i: number) =>
                `Test ${i + 1}: ${test.passed ? '✅ Passed' : '❌ Failed'} ${test.error ? `- ${test.error}` : ''}`
            )
            .join('\n');

          alert(
            `📊 Submission Results:\n${details}\n\nPassed: ${passedTests}/${totalTests} tests\nScore: ${submission.score} points`
          );
        }
      } else {
        alert(`❌ Submission failed: ${submission.status}`);
      }
    } catch (error) {
      console.error('Failed to submit solution:', error);
      alert('Failed to submit solution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // Data
    challenge,
    loading,
    user,

    // Code editor state
    selectedLanguage,
    code,
    setCode,
    submitting,
    testing,

    // UI state
    activeTab,
    setActiveTab,
    isFullscreen,
    setIsFullscreen,
    editorTheme,
    setEditorTheme,
    fontSize,
    setFontSize,
    showMinimap,
    setShowMinimap,
    expandedSections,
    showAuthModal,
    setShowAuthModal,

    // Handlers
    handleLanguageChange,
    handleEditorDidMount,
    toggleSection,
    handleTestCode,
    handleSubmit,

    // Navigation
    navigate,
  };
};
