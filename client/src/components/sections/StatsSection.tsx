import { TrendingUp, Users, Code, Award } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Code,
      value: '49',
      label: 'Total Challenges',
      metric: 'across 6 languages',
      color: 'text-blue-400',
    },
    {
      icon: Users,
      value: '15',
      label: 'Z-- Challenges',
      metric: 'custom language focus',
      color: 'text-yellow-400',
    },
    {
      icon: TrendingUp,
      value: '8',
      label: 'Go Challenges',
      metric: 'concurrency & servers',
      color: 'text-cyan-400',
    },
    {
      icon: Award,
      value: '10',
      label: 'Python Challenges',
      metric: 'ML & algorithms',
      color: 'text-green-400',
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          {/* <div className="inline-block rounded-lg px-4 py-2 mb-6">
                <span className="text-gray-400 font-mono text-sm">$ z-monitor --stats --live</span>
            </div> */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Challenge Distribution
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive coverage from beginner Z-- syntax to advanced algorithms
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map(stat => (
            <div
              key={stat.label}
              className="border border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-center mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>

              <div
                className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2 font-mono`}
              >
                {stat.value}
              </div>

              <div className="text-white font-semibold mb-1">{stat.label}</div>
              <div className="text-gray-400 text-sm">{stat.metric}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
