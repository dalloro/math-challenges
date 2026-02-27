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
  isAiEnabled: vi.fn(),
  saveAiEnabled: vi.fn(),
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
    vi.mocked(storage.isAiEnabled).mockReturnValue(true);
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

  it('should render the AI enable toggle', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Enable Gemini AI/i)).toBeDefined();
  });

  it('should toggle AI enabled state and save it', () => {
    vi.mocked(storage.isAiEnabled).mockReturnValue(true);
    
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    const toggle = screen.getByRole('button', { name: /Enable Gemini AI/i });
    fireEvent.click(toggle);

    expect(storage.saveAiEnabled).toHaveBeenCalledWith(false);
    expect(screen.getByText(/Gemini AI features disabled/i)).toBeDefined();
  });

  it('should disable API key fields when AI is disabled', () => {
    vi.mocked(storage.isAiEnabled).mockReturnValue(false);
    
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    const apiKeyInput = screen.getByPlaceholderText(/Enter your Google AI API Key/i);
    expect(apiKeyInput).toBeDisabled();
  });
});
