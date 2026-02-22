import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BulkUpload } from '../components/AdminComponents';

// Mock firebase
vi.mock('../firebase', () => ({
  db: {},
}));

describe('BulkUpload Tooltip', () => {
  it('has the correct positioning classes for the refresh mode tooltip', () => {
    render(<BulkUpload />);
    
    // Find the tooltip container - it has the text "Refresh Mode Logic:"
    const tooltip = screen.getByText(/Refresh Mode Logic:/i).closest('div');
    
    // We expect it to have top-full and mt-2 if we want it to be below
    expect(tooltip?.className).toContain('top-full');
    expect(tooltip?.className).toContain('mt-2');
    expect(tooltip?.className).not.toContain('bottom-full');
    expect(tooltip?.className).not.toContain('mb-2');
  });
});
