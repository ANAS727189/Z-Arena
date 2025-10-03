import { Terminal, Play, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-b-xl p-8 font-mono text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2"></div>
              <div className="mt-8 text-center">
                <div className="text-5xl md:text-7xl font-bold tracking-tight">
                  <span className="text-yellow-400">CODE</span>
                  <span className="text-gray-600 mx-3">•</span>
                  <span className="text-orange-400">COMPETE</span>
                  <span className="text-gray-600 mx-3">•</span>
                  <span className="text-red-400">CONQUER</span>
                </div>
                <div className="text-lg text-gray-400 mt-4 font-sans">
                  The ultimate competitive programming platform
                </div>
              </div>
              <div className="text-center mt-8">
                <span className="text-green-400">$</span>
                <span className="text-white ml-2">
                  Ready to dominate the leaderboards?{' '}
                </span>
                <span className="animate-pulse text-yellow-400">█</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
          <button
            onClick={() => navigate('/challenges')}
            className="group px-10 py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-yellow-400/20"
          >
            <Play className="h-5 w-5" />
            Launch Challenge Mode
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-10 py-4 bg-transparent border-2 border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-gray-400 hover:text-white transition-all duration-200 flex items-center justify-center gap-3">
            <Terminal className="h-5 w-5" />
            Browse Languages
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-12 max-w-5xl mx-auto">
          {[
            { name: 'Z--', color: 'border-yellow-400 text-yellow-400' },
            { name: 'C++', color: 'border-blue-400 text-blue-400' },
            { name: 'Python', color: 'border-green-400 text-green-400' },
            { name: 'Java', color: 'border-orange-400 text-orange-400' },
            { name: 'JavaScript', color: 'border-purple-400 text-purple-400' },
            { name: 'Rust', color: 'border-red-400 text-red-400' },
          ].map(lang => (
            <span
              key={lang.name}
              className={`px-4 py-2 bg-gray-800 border ${lang.color} rounded-full text-sm font-mono hover:bg-gray-700 transition-colors cursor-pointer`}
            >
              {lang.name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">100+</div>
            <div className="text-gray-400 text-sm">Active Challenges</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">6</div>
            <div className="text-gray-400 text-sm">Languages</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">0.1s</div>
            <div className="text-gray-400 text-sm">Avg Runtime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">Live</div>
            <div className="text-gray-400 text-sm">Execution</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
