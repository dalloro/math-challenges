interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8 w-auto" }: LogoProps) {
  return (
    <img 
      src="/logo.svg" 
      alt="Math Challenges Logo" 
      className={`transition-opacity duration-300 ${className}`}
    />
  );
}
