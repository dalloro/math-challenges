import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('App Icons and Favicon', () => {
  it('should have the correct favicon link pointing to logo.svg', () => {
    const html = fs.readFileSync('index.html', 'utf-8');
    expect(html).toContain('<link rel="icon" type="image/svg+xml" href="/logo.svg?v=2" />');
  });

  it('should have an apple-touch-icon link pointing to apple-touch-icon.png', () => {
    const html = fs.readFileSync('index.html', 'utf-8');
    expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />');
  });

  it('should have a link to the web manifest', () => {
    const html = fs.readFileSync('index.html', 'utf-8');
    expect(html).toContain('<link rel="manifest" href="/manifest.webmanifest" />');
  });
});
