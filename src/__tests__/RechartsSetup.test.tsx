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
