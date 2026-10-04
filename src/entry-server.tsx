/**
 * Build-time prerender entry. scripts/prerender.mjs calls render() and writes
 * the markup into dist/index.html, so crawlers and no-JS visitors get the full
 * page as static HTML; src/main.tsx then hydrates it.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
