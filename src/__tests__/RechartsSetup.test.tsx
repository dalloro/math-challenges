import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AnalyticsPlaceholder } from '../components/AnalyticsPlaceholder';

// Mock ResizeObserver class
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = MockResizeObserver as any;

// Mock ResponsiveContainer to avoid width/height warnings in tests
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts') as any;
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: '100%', height: '100%', minWidth: '100px', minHeight: '100px' }}>
        {children}
      </div>
    ),
  };
});

describe('Recharts Setup', () => {
  it('should render the placeholder chart without crashing', () => {
    const { container } = render(
      <div style={{ width: '500px', height: '500px' }}>
        <AnalyticsPlaceholder />
      </div>
    );
    expect(container).toBeInTheDocument();
  });
});
