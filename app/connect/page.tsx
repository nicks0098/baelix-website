'use client';

import { useEffect, useRef, useState } from 'react';

type ProviderId = 'all' | 'openai' | 'gemini' | 'github' | 'jules' | 'openrouter';
type ConnectionPhase = 'idle' | 'launching' | 'handoff';

const providers = [
  {
    id: 'openai' as const,
    name: 'OpenAI',
    mark: 'AI',
    description: 'Official account authorization',
  },
  {
    id: 'gemini' as const,
    name: 'Gemini',
    mark: '✦',
    description: 'Official Google account authorization',
  },
  {
    id: 'github' as const,
    name: 'GitHub Copilot',
    mark: 'GH',
    description: 'Official GitHub OAuth',
  },
  {
    id: 'jules' as const,
    name: 'Google Jules',
    mark: 'J',
    description: 'Remote repository coding',
  },
  {
    id: 'openrouter' as const,
    name: 'OpenRouter',
    mark: 'OR',
    description: 'Secure PKCE authorization',
  },
];

export default function UniversalConnectorPage() {
  const [activeProvider, setActiveProvider] = useState<ProviderId | null>(null);
  const [phase, setPhase] = useState<ConnectionPhase>('idle');
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  function launchConnector(providerId: ProviderId) {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setActiveProvider(providerId);
    setPhase('launching');

    timers.current.push(
      window.setTimeout(() => {
        window.location.assign(`baelix://connect/${providerId}`);
      }, 650),
      window.setTimeout(() => setPhase('handoff'), 1750),
    );
  }

  const status =
    phase === 'launching'
      ? 'Opening BAELIX securely…'
      : phase === 'handoff'
        ? 'Continue authorization in BAELIX'
        : 'Choose an account to connect';

  return (
    <main className={`connector-page phase-${phase}`}>
      <div className="connector-noise" aria-hidden="true" />
      <div className="connector-aura aura-one" aria-hidden="true" />
      <div className="connector-aura aura-two" aria-hidden="true" />

      <header className="connector-header">
        <a className="connector-brand" href="/" aria-label="BAELIX home">
          <img src="/baelix-signature.svg" alt="" width="34" height="34" />
          <span>BAELIX</span>
        </a>
        <span className="secure-label"><i /> Secure desktop handoff</span>
      </header>

      <section className="connector-shell" aria-labelledby="connector-title">
        <div className="connector-copy">
          <p className="connector-eyebrow">UNIVERSAL CONNECTOR</p>
          <h1 id="connector-title">One click.<br /><span>Every real connection.</span></h1>
          <p>
            BAELIX opens each provider’s official authorization flow. This page
            never receives your password, access token, or private account data.
          </p>
        </div>

        <div className="connection-stage" aria-live="polite">
          <div className="connection-orbit orbit-outer" aria-hidden="true" />
          <div className="connection-orbit orbit-inner" aria-hidden="true" />
          <div className="connection-beam beam-one" aria-hidden="true"><i /></div>
          <div className="connection-beam beam-two" aria-hidden="true"><i /></div>
          <div className="connection-beam beam-three" aria-hidden="true"><i /></div>
          <div className="connection-beam beam-four" aria-hidden="true"><i /></div>
          <div className="connection-beam beam-five" aria-hidden="true"><i /></div>

          <div className="connector-core">
            <img src="/baelix-signature.svg" alt="BAELIX" width="70" height="70" />
            <span>{status}</span>
            <small>
              {activeProvider === 'all'
                ? 'Available providers will open one by one'
                : activeProvider
                  ? providers.find((provider) => provider.id === activeProvider)?.name
                  : 'Nothing connects without your approval'}
            </small>
          </div>

          <div className="provider-nodes">
            {providers.map((provider, index) => (
              <button
                type="button"
                key={provider.id}
                className={`provider-node provider-node-${index + 1} ${activeProvider === provider.id || activeProvider === 'all' ? 'is-active' : ''}`}
                onClick={() => launchConnector(provider.id)}
                disabled={phase === 'launching'}
                aria-label={`Connect ${provider.name}`}
              >
                <b>{provider.mark}</b>
                <span>{provider.name}</span>
                <small>{provider.description}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="connector-actions">
          <button
            type="button"
            className="connect-all-button"
            onClick={() => launchConnector('all')}
            disabled={phase === 'launching'}
          >
            <span>{phase === 'launching' ? 'Preparing secure handoff' : 'Connect available accounts'}</span>
            <i aria-hidden="true">→</i>
          </button>
          <p>
            BAELIX must be installed. <a href="/#download">Get BAELIX for Windows</a>
          </p>
        </div>
      </section>
    </main>
  );
}
