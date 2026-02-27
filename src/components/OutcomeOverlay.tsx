import { useEffect } from 'react';

interface OutcomeOverlayProps {
  type: 'happy' | 'sad' | 'completed' | null;
  onComplete: () => void;
}

export function OutcomeOverlay({ type, onComplete }: OutcomeOverlayProps) {
  useEffect(() => {
    if (type) {
      // 2 beats of 1s each = 2000ms.
      // We use slightly more to ensure the final animation frame finishes.
      const timer = setTimeout(() => {
        onComplete();
      }, 2100); 
      return () => clearTimeout(timer);
    }
  }, [type, onComplete]);

  if (!type) return null;

  const imageSrc = `/${type}.png`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none bg-white/5 backdrop-blur-[1px] animate-in fade-in duration-300">
      <div className="w-1/2 sm:w-1/3 max-w-[300px] flex items-center justify-center">
        <img 
          src={imageSrc} 
          alt={type}
          className="w-full h-auto drop-shadow-2xl animate-heart-beat"
        />
      </div>
    </div>
  );
}
