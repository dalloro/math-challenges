import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SolutionDisplay } from '../SolutionDisplay';

describe('SolutionDisplay Component', () => {
  const mockHint = 'Think about prime numbers.';
  const mockSolution = 'The answer is 7.';

  it('renders both hint and solution when hint is present', () => {
    render(<SolutionDisplay socraticHint={mockHint} finalIdealSolution={mockSolution} />);
    
    expect(screen.getByText(/Socratic Hint/i)).toBeInTheDocument();
    expect(screen.getByText(mockHint)).toBeInTheDocument();
    expect(screen.getByText(/Ideal Solution/i)).toBeInTheDocument();
  });

  it('is collapsed by default for the ideal solution', () => {
    render(<SolutionDisplay socraticHint={mockHint} finalIdealSolution={mockSolution} />);
    
    // The solution text itself should not be visible by default
    expect(screen.queryByText(mockSolution)).not.toBeInTheDocument();
  });

  it('expands the solution when the toggle is clicked', () => {
    render(<SolutionDisplay socraticHint={mockHint} finalIdealSolution={mockSolution} />);
    
    const toggle = screen.getByText(/Show Ideal Solution/i);
    fireEvent.click(toggle);
    
    expect(screen.getByText(mockSolution)).toBeInTheDocument();
  });

  it('renders only solution box when hint is null', () => {
    render(<SolutionDisplay socraticHint={null} finalIdealSolution={mockSolution} />);
    
    expect(screen.queryByText(/Socratic Hint/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Ideal Solution/i)).toBeInTheDocument();
  });
});
