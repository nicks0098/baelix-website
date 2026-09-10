'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Check,
  ChevronRight,
  Command,
  FileCode2,
  MessageSquareText,
  Play,
  TerminalSquare,
} from 'lucide-react';

const steps = [
  {
    id: 'ask',
    number: '01',
    short: 'Ask',
    title: 'Describe the outcome.',
    copy: 'Ask for an app, website, document, image, or focused improvement in natural language. BAELIX keeps the goal and project location together.',
    image: '/screenshots/baelix-create.png',
    alt: 'A creation request in BAELIX Free',
    icon: MessageSquareText,
    activity: [
      'Understanding the request',
      'Mapping the project structure',
      'Preparing a visible plan',
    ],
  },
  {
    id: 'watch',
    number: '02',
    short: 'Watch',
    title: 'Follow every real action.',
    copy: 'The live activity panel preserves each update, tool, and command in sequence so progress never disappears between replies.',
    image: '/screenshots/baelix-activity.png',
    alt: 'BAELIX automation activity panels',
    icon: TerminalSquare,
    activity: [
      'Reading the selected project',
      'Applying the requested changes',
      'Running the project checks',
    ],
  },
  {
    id: 'take',
    number: '03',
    short: 'Take',
    title: 'Use what BAELIX made.',
    copy: 'Finished work stays in the chosen folder. BAELIX closes with a clear result and the exact next step for opening or running it.',
    image: '/screenshots/baelix-complete.png',
    alt: 'A completed BAELIX Builder task',
    icon: FileCode2,
    activity: [
      'Changes verified',
      'Files saved in the chosen folder',
      'Run instructions ready',
    ],
  },
];

export function ExperienceDemo() {
  const [active, setActive] = useState(0);
  const demoRef = useRef<HTMLDivElement>(null);
  const step = steps[active];
  const StepIcon = step.icon;

  const selectStep = useCallback((index: number) => {
    const next = Math.max(0, Math.min(steps.length - 1, index));
    setActive(next);

    const demo = demoRef.current;
    if (!demo) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 820px)').matches
    ) {
      demo.style.setProperty('--demo-progress', `${(next + 1) / steps.length}`);
      return;
    }
    const bounds = demo.getBoundingClientRect();
    const absoluteTop = window.scrollY + bounds.top;
    const trackLength = Math.max(
      demo.offsetHeight - window.innerHeight * 0.72,
      1,
    );
    const target =
      absoluteTop -
      window.innerHeight * 0.24 +
      trackLength * (next / (steps.length - 1));
    window.scrollTo({
      top: target,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  }, []);

  useEffect(() => {
    const demo = demoRef.current;
    if (!demo) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 820px)').matches
    ) {
      demo.style.setProperty('--demo-progress', `${1 / steps.length}`);
      return;
    }

    let frame = 0;
    const updateFromScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const bounds = demo.getBoundingClientRect();
        const absoluteTop = window.scrollY + bounds.top;
        const trackStart = absoluteTop - window.innerHeight * 0.24;
        const trackLength = Math.max(
          demo.offsetHeight - window.innerHeight * 0.72,
          1,
        );
        const progress = Math.max(
          0,
          Math.min(1, (window.scrollY - trackStart) / trackLength),
        );
        const next = Math.min(
          steps.length - 1,
          Math.floor(progress * steps.length),
        );
        demo.style.setProperty('--demo-progress', `${progress}`);
        setActive((current) => (current === next ? current : next));
        frame = 0;
      });
    };

    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll, { passive: true });
    updateFromScroll();

    return () => {
      window.removeEventListener('scroll', updateFromScroll);
      window.removeEventListener('resize', updateFromScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="experience-demo" ref={demoRef}>
      <div
        className="experience-stepper"
        role="tablist"
        aria-label="How BAELIX works"
      >
        <div className="experience-progress" aria-hidden="true">
          <span />
        </div>
        {steps.map((item, index) => (
          <button
            type="button"
            role="tab"
            id={`experience-tab-${item.id}`}
            aria-controls="experience-panel"
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            className={active === index ? 'active' : ''}
            onClick={() => selectStep(index)}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
                return;
              event.preventDefault();
              const next =
                (index + (event.key === 'ArrowRight' ? 1 : -1) + steps.length) %
                steps.length;
              selectStep(next);
              requestAnimationFrame(() =>
                document
                  .getElementById(`experience-tab-${steps[next].id}`)
                  ?.focus(),
              );
            }}
            key={item.id}
          >
            <span>{item.number}</span>
            <strong>{item.short}</strong>
            <ChevronRight size={16} />
          </button>
        ))}
      </div>

      <article
        className="experience-stage"
        id="experience-panel"
        role="tabpanel"
        aria-labelledby={`experience-tab-${step.id}`}
        aria-live="polite"
        key={step.id}
      >
        <div className="experience-stage-copy">
          <div className="stage-icon">
            <StepIcon size={22} />
          </div>
          <p className="stage-kicker">
            {step.number} / {step.short}
          </p>
          <h3>{step.title}</h3>
          <p>{step.copy}</p>
          <button
            type="button"
            className="next-step"
            onClick={() => selectStep((active + 1) % steps.length)}
          >
            {active === steps.length - 1 ? (
              <>
                <Play size={16} /> Replay experience
              </>
            ) : (
              <>
                Next: {steps[active + 1].short} <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>

        <div className="experience-screen" data-tilt>
          <div className="experience-screen-bar">
            <div>
              <i />
              <i />
              <i />
            </div>
            <span>
              <span className="live-dot" /> BAELIX is working
            </span>
          </div>
          <Image
            src={step.image}
            alt={step.alt}
            width={1917}
            height={1078}
            priority={active === 0}
          />
          <div className="live-activity" aria-live="polite">
            <div className="live-activity-title">
              <Command size={15} />
              <strong>Live activity</strong>
              <span>Visible</span>
            </div>
            {step.activity.map((item, index) => (
              <div
                className="activity-row"
                style={
                  { '--activity-delay': `${index * 120}ms` } as CSSProperties
                }
                key={item}
              >
                {index === step.activity.length - 1 && active === 2 ? (
                  <Check size={14} />
                ) : (
                  <span className="activity-pulse" />
                )}
                <span>{item}</span>
                <code>
                  {active === 2
                    ? 'complete'
                    : index === 1
                      ? 'apply_patch'
                      : 'read_project'}
                </code>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
