import logoUrl from '../assets/logo.png';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8 w-auto" }: LogoProps) {
  return (
    <img 
      src={logoUrl} 
      alt="Math Challenges Logo" 
      className={`transition-opacity duration-300 ${className}`}
    />
  );
}
