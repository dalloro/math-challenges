import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Logo } from '../Logo';

describe('Logo Component', () => {
  it('renders correctly', () => {
    render(<Logo />);
    const logoImg = screen.getByAltText(/Math Challenges Logo/i);
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', expect.stringContaining('logo.png'));
  });

  it('applies custom className', () => {
    const customClass = 'custom-logo-class';
    render(<Logo className={customClass} />);
    const logoImg = screen.getByAltText(/Math Challenges Logo/i);
    expect(logoImg).toHaveClass(customClass);
  });
});
