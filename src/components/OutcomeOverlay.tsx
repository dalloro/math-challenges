import { useEffect, useState } from 'react';

interface OutcomeOverlayProps {
  type: 'happy' | 'sad' | 'completed' | null;
  onComplete: () => void;
}

export function OutcomeOverlay({ type, onComplete }: OutcomeOverlayProps) {
  const [internalVisible, setInternalVisible] = useState(false);

  useEffect(() => {
    if (type) {
      setInternalVisible(true);
      const timer = setTimeout(() => {
        setInternalVisible(false);
        onComplete();
      }, 2100); 
      return () => clearTimeout(timer);
    }
  }, [type, onComplete]);

  if (!type || !internalVisible) return null;

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
