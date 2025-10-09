import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils'; 


const faqs = [
  {
    question: "What is Z-Arena?",
    answer: "Z-Arena is a modern, full-stack competitive programming platform. It allows users to solve challenges, compete in real-time PvP battles ('Wars'), and climb global leaderboards using various languages, including the custom Z-- language."
  },
  {
    question: "What is the Z-- language?",
    answer: "Z-- is a custom programming language created for this platform. It's designed to be a core part of the Z-Arena experience, with 15+ challenges dedicated to helping you master its unique syntax and features. The platform uses a custom-built compiler for Z--."
  },
  {
    question: "How does the 'War' (PvP) mode work?",
    answer: "The 'War' mode is a real-time, head-to-head battle system. You can challenge another user to solve the same problem under a time limit. The system uses an ELO rating to track your competitive skill and rank you on the leaderboards."
  },
  {
    question: "What other languages are supported?",
    answer: "Besides Z--, the platform uses the Judge0 API to support a wide range of popular languages, including C++, Python, JavaScript, Go, and Rust. You can solve most challenges in the language you're most comfortable with."
  },
  {
    question: "Is Z-Arena open source?",
    answer: "Yes, Z-Arena is an open-source project. We welcome contributions from the community, whether it's adding new challenges, improving the UI, or fixing bugs. You can find the repository on GitHub."
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block rounded-full bg-green-500/10 px-4 py-1.5 mb-4">
            <span className="font-semibold text-sm text-green-400">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about Z-Arena, our features, and how to get started.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="rounded-xl border border-white/10 bg-gray-900/30 backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left p-6"
              >
                <h3 className={cn(
                  "text-lg font-semibold transition-colors",
                  activeIndex === index ? "text-green-400" : "text-white"
                )}>
                  {faq.question}
                </h3>
                {activeIndex === index 
                  ? <Minus className="w-5 h-5 text-gray-400" /> 
                  : <Plus className="w-5 h-5 text-gray-400" />
                }
              </button>

              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto" },
                      collapsed: { opacity: 0, height: 0 }
                    }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;