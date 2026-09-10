'use client';

import { useEffect } from 'react';

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

export function SiteMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const marketingSite =
      document.querySelector<HTMLElement>('.marketing-site');
    if (!marketingSite) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.belief-section > .section-tag, .belief-grid > *, .feature-card, .section-heading > *, .experience-demo, .guide-card, .privacy-note, .install-intro, .install-steps article, .creators-section > .section-tag, .creators-grid > *',
      ),
    );

    revealTargets.forEach((target) => target.classList.add('reveal-target'));

    const revealGroups = [
      '.feature-grid > .feature-card',
      '.guide-grid > .guide-card',
      '.install-steps > article',
      '.creators-grid > *',
    ];
    revealGroups.forEach((selector) => {
      document
        .querySelectorAll<HTMLElement>(selector)
        .forEach((target, index) => {
          target.style.setProperty(
            '--reveal-delay',
            `${Math.min(index, 4) * 90}ms`,
          );
        });
    });

    marketingSite.classList.add('motion-ready');
    if (reducedMotion) marketingSite.classList.add('reduced-motion');

    let revealObserver: IntersectionObserver | undefined;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((target) => target.classList.add('is-visible'));
    } else {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver?.unobserve(entry.target);
          });
        },
        { threshold: 0.13, rootMargin: '0px 0px -9% 0px' },
      );
      revealTargets.forEach((target) => revealObserver?.observe(target));
    }

    const readyFrame = requestAnimationFrame(() =>
      marketingSite.classList.add('page-ready'),
    );
    const rippleTimers = new Map<HTMLElement, number>();
    let lastTilt: HTMLElement | null = null;
    let lastMagnetic: HTMLElement | null = null;

    const resetTilt = (target: HTMLElement | null) => {
      if (!target) return;
      target.style.setProperty('--tilt-x', '0deg');
      target.style.setProperty('--tilt-y', '0deg');
      target.style.setProperty('--tilt-shift-x', '0px');
      target.style.setProperty('--tilt-shift-y', '0px');
    };

    const resetMagnetic = (target: HTMLElement | null) => {
      if (!target) return;
      target.style.setProperty('--magnetic-x', '0px');
      target.style.setProperty('--magnetic-y', '0px');
    };

    const closestElement = (target: EventTarget | null, selector: string) =>
      target instanceof Element ? target.closest<HTMLElement>(selector) : null;

    const updatePointer = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
      if (reducedMotion || event.pointerType === 'touch') return;

      const tiltTarget = closestElement(event.target, '[data-tilt]');
      if (lastTilt && lastTilt !== tiltTarget) resetTilt(lastTilt);
      lastTilt = tiltTarget;
      if (tiltTarget) {
        const bounds = tiltTarget.getBoundingClientRect();
        const x =
          (event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5;
        const y =
          (event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5;
        tiltTarget.style.setProperty('--tilt-x', `${(-y * 3.4).toFixed(2)}deg`);
        tiltTarget.style.setProperty('--tilt-y', `${(x * 4.2).toFixed(2)}deg`);
        tiltTarget.style.setProperty(
          '--tilt-shift-x',
          `${(x * 8).toFixed(1)}px`,
        );
        tiltTarget.style.setProperty(
          '--tilt-shift-y',
          `${(y * 8).toFixed(1)}px`,
        );
      }

      const magneticTarget = closestElement(event.target, '.magnetic-cta');
      if (lastMagnetic && lastMagnetic !== magneticTarget)
        resetMagnetic(lastMagnetic);
      lastMagnetic = magneticTarget;
      if (magneticTarget) {
        const bounds = magneticTarget.getBoundingClientRect();
        magneticTarget.style.setProperty(
          '--magnetic-x',
          `${((event.clientX - bounds.left - bounds.width / 2) * 0.11).toFixed(1)}px`,
        );
        magneticTarget.style.setProperty(
          '--magnetic-y',
          `${((event.clientY - bounds.top - bounds.height / 2) * 0.11).toFixed(1)}px`,
        );
      }
    };

    const onPointerOver = (event: PointerEvent) => {
      if (closestElement(event.target, 'a, button, [data-tilt]'))
        root.classList.add('pointer-interactive');
    };

    const onPointerOut = (event: PointerEvent) => {
      const related =
        event.relatedTarget instanceof Element ? event.relatedTarget : null;
      const fromTilt = closestElement(event.target, '[data-tilt]');
      if (fromTilt && (!related || !fromTilt.contains(related))) {
        resetTilt(fromTilt);
        if (lastTilt === fromTilt) lastTilt = null;
      }
      const fromMagnetic = closestElement(event.target, '.magnetic-cta');
      if (fromMagnetic && (!related || !fromMagnetic.contains(related))) {
        resetMagnetic(fromMagnetic);
        if (lastMagnetic === fromMagnetic) lastMagnetic = null;
      }
      if (!related?.closest('a, button, [data-tilt]'))
        root.classList.remove('pointer-interactive');
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reducedMotion) return;
      const target = closestElement(event.target, '.magnetic-cta');
      if (!target) return;
      const bounds = target.getBoundingClientRect();
      target.style.setProperty(
        '--ripple-x',
        `${event.clientX - bounds.left}px`,
      );
      target.style.setProperty('--ripple-y', `${event.clientY - bounds.top}px`);
      target.classList.remove('is-rippling');
      void target.offsetWidth;
      target.classList.add('is-rippling');
      const existing = rippleTimers.get(target);
      if (existing) window.clearTimeout(existing);
      rippleTimers.set(
        target,
        window.setTimeout(() => {
          target.classList.remove('is-rippling');
          rippleTimers.delete(target);
        }, 720),
      );
    };

    let scrollFrame = 0;
    const updateScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        const available =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = available > 0 ? window.scrollY / available : 0;
        const heroProgress = clamp(
          window.scrollY / Math.max(window.innerHeight * 0.92, 1),
        );
        root.style.setProperty('--scroll-progress', `${progress}`);
        root.style.setProperty('--hero-scroll', `${heroProgress}`);
        root.style.setProperty(
          '--hero-scroll-y',
          `${(heroProgress * 34).toFixed(1)}px`,
        );
        root.style.setProperty(
          '--hero-scroll-scale',
          `${(1 - heroProgress * 0.045).toFixed(3)}`,
        );
        root.style.setProperty(
          '--hero-scroll-tilt',
          `${(heroProgress * 2.4).toFixed(2)}deg`,
        );
        document
          .querySelector('.site-header')
          ?.classList.toggle('is-scrolled', window.scrollY > 24);

        const experience = document.querySelector<HTMLElement>('#experience');
        if (experience) {
          const bounds = experience.getBoundingClientRect();
          const experienceProgress = clamp(
            (window.innerHeight * 0.78 - bounds.top) /
              Math.max(bounds.height, 1),
          );
          root.style.setProperty(
            '--experience-scroll',
            `${experienceProgress}`,
          );
        }
        scrollFrame = 0;
      });
    };

    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('.site-header nav a'),
    );
    const navSections = navLinks
      .map((link) => document.querySelector<HTMLElement>(link.hash))
      .filter((section): section is HTMLElement => Boolean(section));
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const active = link.hash === `#${entry.target.id}`;
            link.toggleAttribute('data-active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-34% 0px -56% 0px' },
    );
    navSections.forEach((section) => navObserver.observe(section));

    window.addEventListener('pointermove', updatePointer, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    updateScroll();

    return () => {
      revealObserver?.disconnect();
      navObserver.disconnect();
      cancelAnimationFrame(readyFrame);
      window.removeEventListener('pointermove', updatePointer);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      rippleTimers.forEach((timer) => window.clearTimeout(timer));
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="pointer-aura" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />
    </>
  );
}
