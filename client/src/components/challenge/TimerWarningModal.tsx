import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertTriangle, ArrowLeft, Play } from 'lucide-react';

interface TimerWarningModalProps {
  isOpen: boolean;
  challengeTitle: string;
  onBack: () => void;
  onContinue: () => void;
}

export const TimerWarningModal: React.FC<TimerWarningModalProps> = ({
  isOpen,
  challengeTitle,
  onBack,
  onContinue,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Blur Background */}
        <motion.div
          initial={{ backdropFilter: 'blur(0px)' }}
          animate={{ backdropFilter: 'blur(8px)' }}
          exit={{ backdropFilter: 'blur(0px)' }}
          className="absolute inset-0 bg-black/50"
          onClick={onBack}
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <Card className="bg-[var(--background-secondary)] border-[var(--border-primary)] shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                Challenge Timer Warning
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  {challengeTitle}
                </h3>
                
                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="font-semibold text-yellow-400">⚠️ Important:</span> Once you start this challenge, the timer will begin running and{' '}
                    <span className="font-semibold text-white">cannot be stopped or paused</span>. 
                    The timer will only stop when you submit your solution.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 border-gray-600 text-gray-900 hover:bg-gray-900 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                <Button
                  onClick={onContinue}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};