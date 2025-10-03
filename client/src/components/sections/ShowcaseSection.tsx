import {
  Code,
  Play,
  ArrowRight,
  CheckCircle,
  Clock,
  Trophy,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShowcaseSection = () => {
  const navigate = useNavigate();

  const languages = [
    { name: 'Z--', color: 'text-yellow-400', challenges: 25, featured: true },
    { name: 'C++', color: 'text-blue-400', challenges: 42 },
    { name: 'Python', color: 'text-green-400', challenges: 38 },
    { name: 'Java', color: 'text-orange-400', challenges: 33 },
    { name: 'JavaScript', color: 'text-purple-400', challenges: 29 },
    { name: 'Rust', color: 'text-red-400', challenges: 18 },
  ];

  const sampleChallenges = [
    {
      id: 'hello-world-z',
      title: 'Hello Z-- World',
      difficulty: 'Easy',
      points: 10,
      description: 'Welcome to Z--! Learn basic syntax and program structure.',
      solved: 1247,
      difficultyColor: 'text-green-400 bg-green-400/10',
    },
    {
      id: 'two-sum-array',
      title: 'Two Sum Problem',
      difficulty: 'Medium',
      points: 50,
      description: 'Find two numbers in array that add up to target sum.',
      solved: 823,
      difficultyColor: 'text-yellow-400 bg-yellow-400/10',
    },
    {
      id: 'reverse-string',
      title: 'Reverse String',
      difficulty: 'Easy',
      points: 20,
      description: 'Reverse a string using Z-- language features.',
      solved: 956,
      difficultyColor: 'text-green-400 bg-green-400/10',
    },
  ];
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          {/* <div className="inline-block rounded-lg px-4 py-2 mb-6">
                <span className="text-gray-400 font-mono text-sm">$ z-showcase --languages --challenges</span>
            </div> */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Language & Challenge Hub
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From Z-- fundamentals to advanced multi-language algorithmic
            challenges
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Code className="w-6 h-6 text-yellow-400" />
              Supported Languages
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {languages.map(lang => (
                <div
                  key={lang.name}
                  className="group border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-mono font-bold ${lang.color}`}>
                      {lang.name}
                    </span>
                    {lang.featured && (
                      <span className="px-2 py-1 bg-yellow-400 text-black text-xs rounded-full font-bold">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm mb-2">
                    {lang.challenges} challenges available
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">Judge0 enabled</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border border-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Language Stats:</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-yellow-400">6</div>
                  <div className="text-xs text-gray-500">Total Languages</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-400">185</div>
                  <div className="text-xs text-gray-500">Total Challenges</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-400">0.15s</div>
                  <div className="text-xs text-gray-500">Avg Compile Time</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Featured Challenges
            </h3>
            <div className="space-y-4">
              {sampleChallenges.map(challenge => (
                <div
                  key={challenge.title}
                  className="group border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all cursor-pointer"
                  onClick={() => navigate('/challenges')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                        {challenge.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${challenge.difficultyColor}`}
                        >
                          {challenge.difficulty}
                        </span>
                        <span className="text-yellow-400 text-sm font-mono">
                          {challenge.points}pts
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  <p className="text-gray-400 text-sm mb-3">
                    {challenge.description}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4 text-gray-500">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {challenge.solved.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~10min
                      </span>
                    </div>
                    <span className="text-yellow-400 font-mono">
                      <Play className="w-3 h-3 inline mr-1" />
                      Start
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/challenges')}
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors inline-flex items-center gap-2"
              >
                Browse All Challenges
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
