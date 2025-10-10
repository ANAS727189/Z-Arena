import { motion, useInView, useSpring } from 'framer-motion';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

// --- Reusable Animated Counter Component ---

// 1. Define the type for the methods we will expose via the ref.
export interface CounterRef {
  restart: () => void;
}

const AnimatedCounter = forwardRef<CounterRef, { value: number; isInView: boolean }>(
  ({ value, isInView }, ref) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    
    const springValue = useSpring(0, {
      stiffness: 40,
      damping: 40,
    });

    useImperativeHandle(ref, () => ({
      restart: () => {
        springValue.set(0);
        springValue.set(value);
      },
    }));

    useEffect(() => {
      if (isInView) {
        springValue.set(value);
      }
    }, [isInView, value, springValue]);

    useEffect(() => {
      const unsubscribe = springValue.on("change", (latest) => {
        if (spanRef.current) {
          spanRef.current.textContent = Math.round(latest).toLocaleString();
        }
      });
      return () => unsubscribe();
    }, [springValue]);

    return <span ref={spanRef}>0</span>;
  }
);

const StatsSection = () => {
  const stats = [
    { value: 50, label: 'Total Challenges', metric: 'across 6 languages' },
    { value: 15, label: 'Z-- Challenges', metric: 'custom language focus' },
    { value: 10, label: 'Go Challenges', metric: 'concurrency & servers' },
    { value: 15, label: 'Python Challenges', metric: 'ML & algorithms' },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });
  const counterRefs = useRef<(CounterRef | null)[]>([]);

  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block rounded-full bg-green-500/10 px-4 py-1.5 mb-4">
            <span className="font-semibold text-sm text-green-400">By The Numbers</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            The Arena at a Glance
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A growing ecosystem of challenges and competitive features.
          </p>
        </motion.div>

        <motion.div 
          ref={sectionRef}
          className="rounded-xl backdrop-blur-md shadow-2xl shadow-green-500/10"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="p-8 text-center"
                onMouseEnter={() => counterRefs.current[i]?.restart()}
              >
                <div className="text-5xl md:text-6xl font-bold font-mono text-green-400 mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                  <AnimatedCounter
                    ref={(el) => { counterRefs.current[i] = el; }}
                    value={stat.value}
                    isInView={isInView}
                  />+
                </div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;