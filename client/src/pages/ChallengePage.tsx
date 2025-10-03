import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Trophy, 
  User, 
  CheckCircle, 
  AlertTriangle,
  Loader2 
} from 'lucide-react';
import { challengeService } from '@/services/challengeService';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';
import type { Challenge } from '@/types';

export const ChallengePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('z--');
  const [code, setCode] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
        const firstLang = challengeData.metadata.supportedLanguages?.[0] || 'z--';
        setSelectedLanguage(firstLang);
        
        // Try to get starter code from languages or fallback to code property
        let starterCode = '';
        if (challengeData.languages && challengeData.languages[firstLang]) {
          starterCode = challengeData.languages[firstLang].starterCode || '';
        } else if (challengeData.code?.starterCode) {
          starterCode = challengeData.code.starterCode;
        }
        setCode(starterCode);
      } else {
        // Challenge not found
        navigate('/challenges');
      }
    } catch (error) {
      console.error('Failed to load challenge:', error);
      navigate('/challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    if (challenge && challenge.languages && challenge.languages[language]) {
      setCode(challenge.languages[language].starterCode || '');
    } else if (challenge && challenge.code?.starterCode) {
      setCode(challenge.code.starterCode);
    }
  };

  const handleTestCode = async () => {
    if (!challenge || !code.trim()) {
      alert('Please write some code before testing!');
      return;
    }

    setTesting(true);
    try {
      const result = await challengeService.executeCode({
        code,
        language: selectedLanguage,
        testCases: challenge.testCases.slice(0, 3), // Test only first 3 cases for preview
        timeLimit: challenge.metadata.timeLimit * 60 * 1000
      });
      
      const passedTests = result.testResults.filter(r => r.passed).length;
      const totalTests = result.testResults.length;
      
      if (result.success) {
        const details = result.testResults.map((test, i) => 
          `Test ${i + 1}: ${test.passed ? '✅ Passed' : '❌ Failed'} (${test.executionTime}ms)`
        ).join('\n');
        
        alert(`🧪 Test Results:\n${details}\n\nPassed: ${passedTests}/${totalTests} tests\nScore: ${result.totalScore} points`);
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

    if (!challenge || !code.trim()) {
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
      
      // Show detailed feedback based on execution results
      const passedTests = submission.testResults.filter(result => result.passed).length;
      const totalTests = submission.testResults.length;
      
      if (submission.status === 'success') {
        alert(`🎉 Success! Passed ${passedTests}/${totalTests} tests. Score: ${submission.score} points`);
      } else {
        const firstFailedTest = submission.testResults.find(result => !result.passed);
        const errorMessage = firstFailedTest?.error || 'Some tests failed';
        alert(`❌ Submission failed: ${errorMessage}\nPassed ${passedTests}/${totalTests} tests.`);
      }
    } catch (error) {
      console.error('Failed to submit solution:', error);
      alert('Failed to submit solution. Please check your code and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-500/10 border-green-500';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500';
      case 'hard':
        return 'text-red-400 bg-red-500/10 border-red-500';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading challenge...</span>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Challenge Not Found</h1>
          <p className="text-gray-400 mb-6">The challenge you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/challenges')}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/challenges')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Challenges
            </button>
            <div className="w-px h-6 bg-gray-700" />
            <h1 className="text-xl font-bold text-white">{challenge.metadata.title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getDifficultyColor(challenge.metadata.difficulty)}`}>
              {challenge.metadata.difficulty}
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <Trophy className="w-4 h-4" />
              <span className="font-semibold">{challenge.metadata.points} pts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{challenge.metadata.timeLimit} min</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Problem Statement</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">{challenge.problem.statement}</p>
              </div>
            </div>

            {/* Input/Output Format */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Input Format</h3>
                <p className="text-gray-400 text-sm">{challenge.problem.inputFormat}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Output Format</h3>
                <p className="text-gray-400 text-sm">{challenge.problem.outputFormat}</p>
              </div>
            </div>

            {/* Constraints */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Constraints</h3>
              <p className="text-gray-400 text-sm whitespace-pre-line">{challenge.problem.constraints}</p>
            </div>

            {/* Examples */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Examples</h3>
              {challenge.problem.examples.map((example, index) => (
                <div key={index} className="bg-black border border-gray-700 rounded-lg p-4 mb-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Input:</h4>
                      <pre className="bg-gray-800 p-2 rounded text-sm text-green-400 font-mono">
                        {example.input || '(no input)'}
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Output:</h4>
                      <pre className="bg-gray-800 p-2 rounded text-sm text-blue-400 font-mono">
                        {example.output}
                      </pre>
                    </div>
                  </div>
                  {example.explanation && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Explanation:</h4>
                      <p className="text-gray-300 text-sm">{example.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Solution</h2>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-yellow-400 focus:outline-none"
              >
                {(challenge.metadata.supportedLanguages || ['z--']).map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === 'z--' ? 'Z--' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Simple text area (we can enhance this with Monaco editor later) */}
            <div className="mb-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 bg-black border border-gray-700 rounded-lg p-4 text-gray-300 font-mono text-sm focus:border-yellow-400 focus:outline-none resize-none"
                placeholder="Write your solution here..."
                spellCheck={false}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{challenge.stats?.totalSubmissions || 0} submissions</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>{Math.round(((challenge.stats?.successfulSubmissions || 0) / Math.max(challenge.stats?.totalSubmissions || 1, 1)) * 100)}% success rate</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleTestCode}
                  disabled={testing || !code.trim()}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Test Code
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !code.trim()}
                  className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Submit Solution
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};