'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = window.localStorage.getItem(
      'baelix-site-theme',
    ) as Theme | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const next = saved || preferred;
    document
      .querySelector<HTMLElement>('.marketing-site')
      ?.setAttribute('data-theme', next);
    const frame = requestAnimationFrame(() => setTheme(next));
    return () => cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    window.localStorage.setItem('baelix-site-theme', next);
    document
      .querySelector<HTMLElement>('.marketing-site')
      ?.setAttribute('data-theme', next);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb">
          {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
        </span>
      </span>
    </button>
  );
}
