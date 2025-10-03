import { ArrowRight, Users, Code, Trophy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-lg overflow-hidden">
          <div className="p-8 font-mono text-sm">
            <div className="text-center py-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                <span className="text-yellow-400">&gt;</span> Ready to Level Up?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto font-sans">
                Join the competitive programming revolution. Master algorithms,
                compete globally, climb leaderboards.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                <button
                  onClick={() => navigate('/challenges')}
                  className="group bg-yellow-400 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
                >
                  <Users className="w-5 h-5" />
                  Accept Challenge
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate('/leaderboard')}
                  className="group border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-bold text-lg hover:border-gray-400 hover:text-white transition-all duration-200 flex items-center gap-3"
                >
                  <Trophy className="w-5 h-5" />
                  View Leaderboard
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <Code className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-white font-semibold mb-1">Instant Setup</div>
            <div className="text-gray-400 text-sm">
              No downloads, no configs
            </div>
          </div>
          <div className="text-center">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-white font-semibold mb-1">
              Real-time Judging
            </div>
            <div className="text-gray-400 text-sm">Sub-second feedback</div>
          </div>
          <div className="text-center">
            <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-white font-semibold mb-1">
              Global Competition
            </div>
            <div className="text-gray-400 text-sm">Compete worldwide</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
