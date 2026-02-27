import { useEffect, useState } from 'react';

interface OutcomeOverlayProps {
  type: 'happy' | 'sad' | 'completed' | null;
  onComplete: () => void;
}

export function OutcomeOverlay({ type, onComplete }: OutcomeOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (type) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 2000); // 2 seconds total (2 beats)
      return () => clearTimeout(timer);
    }
  }, [type, onComplete]);

  if (!type || !visible) return null;

  const imageSrc = `/${type}.png`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none pointer-events-auto bg-white/10 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="w-1/3 max-w-[300px] flex items-center justify-center">
        <img 
          src={imageSrc} 
          alt={type}
          className="w-full h-auto drop-shadow-2xl animate-heart-beat"
        />
      </div>
    </div>
  );
}
