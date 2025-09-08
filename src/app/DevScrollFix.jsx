'use client';
import { useEffect } from 'react';

export default function DevScrollFix() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const prev = window.history.scrollRestoration;
    
    window.history.scrollRestoration = 'manual';
    requestAnimationFrame(() => window.scrollTo(0, 0));

    return () => {
      window.history.scrollRestoration = prev || 'auto';
    };
  }, []);

  return null;
}
