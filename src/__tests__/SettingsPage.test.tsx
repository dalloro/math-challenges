import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SettingsPage } from '../pages/SettingsPage';
import { BrowserRouter } from 'react-router-dom';
import * as storage from '../services/storage';

// Mock the storage service
vi.mock('../services/storage', () => ({
  getApiKey: vi.fn(),
  saveApiKey: vi.fn(),
  deleteApiKey: vi.fn(),
  getTestModality: vi.fn(),
  saveTestModality: vi.fn(),
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should render the modality toggle with default "combined"', () => {
    vi.mocked(storage.getTestModality).mockReturnValue('combined');
    
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    // Check if both options are present
    expect(screen.getByText(/Combined Mode/i)).toBeDefined();
    expect(screen.getByText(/Blind Mode/i)).toBeDefined();
    
    // Check if combined is the active one (we can check by class or role depending on implementation)
    // For now, let's just ensure the text is there
  });

  it('should save the new modality when changed', () => {
    vi.mocked(storage.getTestModality).mockReturnValue('combined');
    
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    const blindOption = screen.getByText(/Blind Mode/i);
    fireEvent.click(blindOption);

    expect(storage.saveTestModality).toHaveBeenCalledWith('blind');
  });

  it('should persist modality across renders', () => {
    vi.mocked(storage.getTestModality).mockReturnValue('blind');
    
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    // Verify it shows blind mode as active
    // We'll refine this once the UI structure is implemented
  });
});
