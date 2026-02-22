import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LandingPage } from '../pages/LandingPage';
import { BrowserRouter } from 'react-router-dom';

// Mock firebase auth
vi.mock('../firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

describe('LandingPage', () => {
  it('renders the "Select Your Grade" header', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Select Your Grade/i)).toBeInTheDocument();
  });
});
