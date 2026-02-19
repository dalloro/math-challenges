import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from '../App';

describe('App', () => {
  it('renders the landing page title', () => {
    render(<App />);
    expect(screen.getByText(/NON EXISTENT TITLE/i)).toBeInTheDocument();
  });

  it('renders the start challenge button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Start Adaptive Challenge/i })).toBeInTheDocument();
  });
});
