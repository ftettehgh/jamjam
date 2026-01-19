import { useCallback } from 'react';

/**
 * Custom hook to play a completion sound effect
 * Similar to MagicPath's completion sound
 */
export const useCompletionSound = () => {
  const playCompletionSound = useCallback(() => {
    try {
      // Create an AudioContext
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a pleasant "success" chime using multiple tones
      const playTone = (frequency: number, startTime: number, duration: number, volume: number = 0.3) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        // Envelope for smooth attack and decay
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
        
        oscillator.start(audioContext.currentTime + startTime);
        oscillator.stop(audioContext.currentTime + startTime + duration);
      };
      
      // Play a pleasant three-note ascending chime (like a celebration)
      // C5 -> E5 -> G5 (C major chord arpeggio)
      playTone(523.25, 0, 0.3, 0.25);     // C5
      playTone(659.25, 0.15, 0.35, 0.25);  // E5
      playTone(783.99, 0.3, 0.5, 0.3);     // G5
      
    } catch (error) {
      console.warn('Could not play completion sound:', error);
    }
  }, []);

  return { playCompletionSound };
};
