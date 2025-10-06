import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { OnMount } from '@monaco-editor/react';
import { challengeService } from '@/services/challengeService';
import { useAuth } from '@/hooks/useAuth';
import type { Challenge } from '@/types';
import { getStarterCode } from '@/utils/starterCodes';
import { useChallengeTimer } from '@/hooks/useChallengeTimer';

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

  // Test and submission results
  const [testResults, setTestResults] = useState<any[]>([]);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [showTestResults, setShowTestResults] = useState(false);
  const [showSubmissionResult, setShowSubmissionResult] = useState(false);
  
  // User data
  const [userHasSolved, setUserHasSolved] = useState(false);
  const [userSubmissions, setUserSubmissions] = useState<any[]>([]);

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

  // Timer state
  const [showTimerWarning, setShowTimerWarning] = useState(true);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const timer = useChallengeTimer();

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
        
        // Check if user has already solved this challenge and load submissions
        if (user) {
          const hasSolved = await challengeService.hasUserSolvedChallenge(user.$id, challengeId);
          setUserHasSolved(hasSolved);
          
          // Load user submissions for this challenge
          try {
            const submissions = await challengeService.getUserSubmissions(user.$id, challengeId);
            setUserSubmissions(submissions);
          } catch (error) {
            console.error('Failed to load user submissions:', error);
            setUserSubmissions([]);
          }
          
          if (hasSolved) {
            // User has solved this challenge before, start timer automatically
            setShowTimerWarning(false);
            setChallengeStarted(true);
            timer.startTimer();
          } else {
            // User hasn't solved this challenge, show timer warning
            setShowTimerWarning(true);
            setChallengeStarted(false);
          }
        } else {
          // User not logged in, show timer warning
          setShowTimerWarning(true);
          setChallengeStarted(false);
          setUserHasSolved(false);
          setUserSubmissions([]);
        }
        
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

      // Store test results and show the results panel
      setTestResults(result.testResults || []);
      setShowTestResults(true);

      if (!result.success && result.error) {
        // If there's a compilation error, show it in the results
        setTestResults([
          {
            testCaseId: 'error',
            passed: false,
            actualOutput: '',
            executionTime: 0,
            error: result.error,
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to test code:', error);
      // Show error in test results instead of alert
      setTestResults([
        {
          testCaseId: 'error',
          passed: false,
          actualOutput: '',
          executionTime: 0,
          error: 'Failed to test code. Please check your syntax and try again.',
        },
      ]);
      setShowTestResults(true);
    } finally {
      setTesting(false);
    }
  };

  // Timer functions
  const handleStartChallenge = () => {
    setShowTimerWarning(false);
    setChallengeStarted(true);
    timer.startTimer();
  };

  const handleBackToMenu = () => {
    navigate('/challenges');
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

    // Stop the timer when submitting
    timer.stopTimer();

    setSubmitting(true);
    try {
      const submission = await challengeService.submitSolution(
        challenge.id,
        user.$id,
        code,
        selectedLanguage
      );

      // Store submission result and show the result panel
      setSubmissionResult(submission);
      setShowSubmissionResult(true);
      setActiveTab('submissions'); // Switch to submissions tab to show "Your Solution"
      
      // If submission was successful, update user solved status and refresh submissions
      if (submission.status === 'completed') {
        setUserHasSolved(true);
        // Refresh user submissions
        try {
          const updatedSubmissions = await challengeService.getUserSubmissions(user.$id, challenge.id);
          setUserSubmissions(updatedSubmissions);
        } catch (error) {
          console.error('Failed to refresh user submissions:', error);
        }
      }
    } catch (error) {
      console.error('Failed to submit solution:', error);
      // Show error in submission result instead of alert
      setSubmissionResult({
        status: 'failed',
        error: 'Failed to submit solution. Please try again.',
        testResults: [],
        score: 0,
      });
      setShowSubmissionResult(true);
      setActiveTab('submissions');
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

    // Timer functions
    handleStartChallenge,
    handleBackToMenu,
    showTimerWarning,
    challengeStarted,
    timer,

    // Test and submission results
    testResults,
    submissionResult,
    showTestResults,
    setShowTestResults,
    showSubmissionResult,
    setShowSubmissionResult,

    // Navigation
    navigate,
    
    // User data
    userHasSolved,
    userSubmissions,
  };
};
