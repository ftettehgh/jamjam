"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
interface ConfettiCelebrationProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}
interface Confetti {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
}
export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  isVisible,
  onClose,
  title = "Congratulations from JamJam!",
  message = "Operation completed successfully"
}) => {
  const [confettiPieces, setConfettiPieces] = useState<Confetti[]>([]);
  useEffect(() => {
    if (isVisible) {
      // Generate confetti pieces
      const colors = ['#ec4899', '#f97316', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
      const pieces: Confetti[] = [];
      for (let i = 0; i < 80; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 6 + Math.random() * 6,
          rotation: Math.random() * 360
        });
      }
      setConfettiPieces(pieces);
    }
  }, [isVisible]);
  return <AnimatePresence>
      {isVisible && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" onClick={onClose} />

          {/* Confetti Container */}
          <div className="fixed inset-0 pointer-events-none z-[101] overflow-hidden">
            {confettiPieces.map(piece => <motion.div key={piece.id} className="absolute" style={{
          left: `${piece.x}%`,
          top: '-20px',
          width: `${piece.size}px`,
          height: `${piece.size}px`,
          backgroundColor: piece.color,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px'
        }} initial={{
          y: -20,
          opacity: 1,
          rotate: 0
        }} animate={{
          y: window.innerHeight + 50,
          opacity: [1, 1, 0.8, 0],
          rotate: piece.rotation + 720,
          x: [0, (Math.random() - 0.5) * 100]
        }} transition={{
          duration: piece.duration,
          delay: piece.delay,
          ease: [0.25, 0.46, 0.45, 0.94]
        }} />)}
          </div>

          {/* Celebration Card */}
          <motion.div initial={{
        scale: 0,
        opacity: 0,
        y: 100
      }} animate={{
        scale: 1,
        opacity: 1,
        y: 0
      }} exit={{
        scale: 0.8,
        opacity: 0,
        y: 50
      }} transition={{
        type: "spring",
        damping: 20,
        stiffness: 300
      }} className="fixed inset-0 z-[102] flex items-center justify-center p-4">
            <div className="bg-[#1f1f1f] rounded-3xl p-8 md:p-12 border-2 border-pink-600 shadow-2xl max-w-md w-full relative overflow-hidden" onClick={e => e.stopPropagation()}>
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-purple-600/10 to-transparent opacity-50" />
              
              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Success Icon */}
                <motion.div initial={{
              scale: 0,
              rotate: -180
            }} animate={{
              scale: 1,
              rotate: 0
            }} transition={{
              type: "spring",
              delay: 0.2,
              damping: 15,
              stiffness: 200
            }} className="mx-auto w-24 h-24 bg-gradient-to-br from-pink-600 to-pink-500 rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-pink-500 rounded-full animate-ping opacity-30" />
                  <CheckCircle2 className="w-14 h-14 text-white relative z-10" />
                </motion.div>

                {/* Title */}
                <motion.h2 initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.3
            }} className="text-3xl md:text-4xl font-bold text-white mb-3 flex items-center justify-center gap-2">
                  {title}
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </motion.h2>

                {/* Message */}
                <motion.p initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.4
            }} className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                  {message}
                </motion.p>

                {/* Close Button */}
                <motion.button initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.5
            }} onClick={onClose} className="px-8 py-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-900/50 transition-all active:scale-95">
                  Continue
                </motion.button>
              </div>

              {/* Decorative sparkles */}
              <motion.div animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }} transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }} className="absolute top-4 right-4 text-yellow-400/30">
                <Sparkles className="w-8 h-8" />
              </motion.div>
              
              <motion.div animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360]
          }} transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }} className="absolute bottom-4 left-4 text-pink-400/30">
                <Sparkles className="w-10 h-10" />
              </motion.div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
};