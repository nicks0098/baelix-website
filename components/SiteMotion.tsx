'use client';

import { useEffect } from 'react';

export function SiteMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const revealTargets = document.querySelectorAll<HTMLElement>(
      '.section-tag, .belief-grid, .feature-card, .section-heading, .showcase, .guide-card, .privacy-note, .install-intro, .install-steps article, .creators-grid',
    );

    revealTargets.forEach((target) => target.classList.add('reveal-target'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    revealTargets.forEach((target, index) => {
      target.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
      observer.observe(target);
    });

    const updatePointer = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
    };

    let frame = 0;
    const updateScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const available = document.documentElement.scrollHeight - window.innerHeight;
        const progress = available > 0 ? window.scrollY / available : 0;
        root.style.setProperty('--scroll-progress', `${progress}`);
        frame = 0;
      });
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('scroll', updateScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="pointer-aura" aria-hidden="true" />
    </>
  );
}
