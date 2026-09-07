import Image from 'next/image';
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Check,
  Cloud,
  Download,
  ExternalLink,
  FolderOpen,
  ImageIcon,
  KeyRound,
  MonitorDown,
  Play,
  Settings2,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { SiteMotion } from '@/components/SiteMotion';

const DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_BAELIX_DOWNLOAD_URL ??
  'https://github.com/nicks0098/baelix-website/releases/latest';

const features = [
  {
    number: '01',
    icon: Workflow,
    title: 'Automation that works beside you',
    copy: 'Describe what you want. BAELIX plans the work, creates the files, runs approved commands, and keeps the activity visible while it builds.',
  },
  {
    number: '02',
    icon: Bot,
    title: 'One interface, many minds',
    copy: 'BAELIX Free discovers available OpenRouter models and chooses intelligence for the task, while keeping one continuous conversation.',
  },
  {
    number: '03',
    icon: ImageIcon,
    title: 'From words to visual ideas',
    copy: 'Connect Cloudflare Workers AI for free image generation, then create visual work from the same focused BAELIX workspace.',
  },
  {
    number: '04',
    icon: ShieldCheck,
    title: 'Your workspace stays yours',
    copy: 'Chats and credentials stay on your Windows computer. Provider credentials are stored through Windows Credential Manager.',
  },
];

export default function Home() {
  return (
    <main>
      <SiteMotion />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="BAELIX home">
          <Image src="/baelix-signature.svg" alt="" width={42} height={42} priority />
          <span>BAELIX</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#setup">Setup</a>
          <a href="#creators">Creators</a>
        </nav>
        <a className="header-download" href="#download">
          Download <ArrowDown size={16} />
        </a>
      </header>

      <section className="hero" id="top">
        <div className="signal-line" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> Intelligence, connected</p>
          <h1>BAELIX<br /><span>is here.</span></h1>
          <p className="hero-lede">
            One focused space to think, create, and let AI carry work from an idea
            to something real on your computer.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#download">
              <Download size={18} /> Download for Windows
            </a>
            <a className="text-link" href="#experience">
              See BAELIX in action <ArrowRight size={17} />
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="BAELIX Free interface preview">
          <div className="orbital-mark" aria-hidden="true">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <span className="orbit-core" />
          </div>
          <div className="product-frame">
            <div className="frame-bar">
              <span /><span /><span />
              <p>BAELIX / FREE INTELLIGENCE</p>
            </div>
            <Image
              src="/screenshots/baelix-create.png"
              alt="BAELIX Free working on a creative request"
              width={1917}
              height={1078}
              priority
            />
          </div>
        </div>

        <div className="hero-manifesto" aria-label="BAELIX principles">
          <p>Automation is the future.</p>
          <p>Free AI and automation are a modern human right.</p>
        </div>
      </section>

      <div className="motion-ribbon" aria-hidden="true">
        <div>
          <span>BAELIX IS HERE</span><i />
          <span>AUTOMATION IS THE FUTURE</span><i />
          <span>INTELLIGENCE SHOULD BE ACCESSIBLE</span><i />
          <span>BAELIX IS HERE</span><i />
          <span>AUTOMATION IS THE FUTURE</span><i />
          <span>INTELLIGENCE SHOULD BE ACCESSIBLE</span><i />
        </div>
      </div>

      <section className="belief-section section-shell" id="about">
        <div className="section-tag">Why BAELIX</div>
        <div className="belief-grid">
          <h2>AI should not stop at an answer.</h2>
          <div>
            <p className="large-copy">
              BAELIX is a Windows AI workspace designed to turn conversation into
              action—without hiding the work behind it.
            </p>
            <p>
              Ask a question when you need a thought partner. Turn on Automation
              when you want BAELIX to create or improve something on your computer.
              The same chat carries the idea, the activity, and the finished result.
            </p>
          </div>
        </div>
        <div className="feature-grid">
          {features.map(({ number, icon: Icon, title, copy }) => (
            <article className="feature-card" key={number}>
              <div className="feature-top"><span>{number}</span><Icon size={21} /></div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="experience-section" id="experience">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <div className="section-tag">The experience</div>
              <h2>See the idea become real.</h2>
            </div>
            <p>Every stage lives in one timeline—from your first request to the commands, files, and final instructions.</p>
          </div>

          <article className="showcase showcase-wide">
            <div className="showcase-copy">
              <span>01 / Create</span>
              <h3>Ask naturally.</h3>
              <p>Describe the app, website, document, image, or improvement you want. BAELIX understands the intended outcome before it chooses how to help.</p>
            </div>
            <div className="screenshot-window screenshot-create">
              <Image src="/screenshots/baelix-create.png" alt="A creation request in BAELIX Free" width={1917} height={1078} />
            </div>
          </article>

          <div className="showcase-pair">
            <article className="showcase">
              <div className="showcase-copy">
                <span>02 / Follow</span>
                <h3>Watch the live activity.</h3>
                <p>See what BAELIX is doing, which tool it is using, and what changed as the work moves forward.</p>
              </div>
              <div className="screenshot-window screenshot-activity">
                <Image src="/screenshots/baelix-activity.png" alt="BAELIX automation activity panels" width={1586} height={1078} />
              </div>
            </article>
            <article className="showcase">
              <div className="showcase-copy">
                <span>03 / Use</span>
                <h3>Take the finished result.</h3>
                <p>BAELIX keeps completed work in the chosen project and explains how to open or run what it made.</p>
              </div>
              <div className="screenshot-window screenshot-complete">
                <Image src="/screenshots/baelix-complete.png" alt="A completed BAELIX Builder task" width={1487} height={790} />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="setup-section section-shell" id="setup">
        <div className="section-heading setup-heading">
          <div>
            <div className="section-tag">Get connected</div>
            <h2>Ready in a few minutes.</h2>
          </div>
          <p>BAELIX guides you to the provider’s official authorization page. Passwords are never entered inside BAELIX.</p>
        </div>

        <div className="guide-grid">
          <article className="guide-card">
            <div className="guide-icon"><KeyRound size={24} /></div>
            <p className="guide-label">Free intelligence</p>
            <h3>Connect OpenRouter</h3>
            <ol>
              <li><span>1</span><p>Open BAELIX and select <strong>Free</strong> at the top.</p></li>
              <li><span>2</span><p>Open <strong>Settings</strong>, then find “Open free-model pool.”</p></li>
              <li><span>3</span><p>Select <strong>Connect OpenRouter</strong> and approve access in your browser.</p></li>
              <li><span>4</span><p>Return to BAELIX. Eligible free models are discovered automatically.</p></li>
            </ol>
            <a href="https://openrouter.ai/" target="_blank" rel="noreferrer">Visit OpenRouter <ExternalLink size={14} /></a>
          </article>

          <article className="guide-card guide-card-red">
            <div className="guide-icon"><Cloud size={24} /></div>
            <p className="guide-label">Free image intelligence</p>
            <h3>Connect Cloudflare</h3>
            <ol>
              <li><span>1</span><p>Create a free Cloudflare account and open <strong>Workers AI</strong>.</p></li>
              <li><span>2</span><p>Copy your <strong>Account ID</strong> and create a Workers AI API token.</p></li>
              <li><span>3</span><p>In BAELIX Free settings, open “Free image generation.”</p></li>
              <li><span>4</span><p>Paste both values and select <strong>Connect free image intelligence</strong>.</p></li>
            </ol>
            <a href="https://dash.cloudflare.com/?to=/:account/ai/workers-ai" target="_blank" rel="noreferrer">Open Workers AI <ExternalLink size={14} /></a>
          </article>
        </div>

        <div className="privacy-note">
          <ShieldCheck size={22} />
          <div><strong>Built for a personal computer.</strong><p>Your provider credentials stay in Windows Credential Manager, and BAELIX keeps its local memory on your device.</p></div>
        </div>
      </section>

      <section className="install-section" id="download">
        <div className="section-shell">
          <div className="install-intro">
            <div className="section-tag">Install BAELIX</div>
            <h2>Your next idea starts here.</h2>
            <p>BAELIX is currently built for 64-bit Windows.</p>
            <a className="primary-button download-large" href={DOWNLOAD_URL} target="_blank" rel="noreferrer">
              <MonitorDown size={20} /> Download BAELIX
            </a>
            <small>Version 0.1.0 · Windows x64</small>
          </div>
          <div className="install-steps">
            <article><div><Download size={20} /></div><span>01</span><h3>Download</h3><p>Get the latest BAELIX Windows installer from the official release page.</p></article>
            <article><div><Play size={20} /></div><span>02</span><h3>Install</h3><p>Open the installer. If Windows shows a protection notice, review the publisher and choose to continue.</p></article>
            <article><div><Settings2 size={20} /></div><span>03</span><h3>Connect</h3><p>Open Settings and connect OpenRouter. Cloudflare image intelligence is optional.</p></article>
            <article><div><FolderOpen size={20} /></div><span>04</span><h3>Create</h3><p>Choose a project location, turn on Automation when needed, and tell BAELIX what to make.</p></article>
          </div>
        </div>
      </section>

      <section className="creators-section section-shell" id="creators">
        <div className="section-tag">Created by</div>
        <div className="creators-grid">
          <div>
            <h2>Built with a belief in accessible intelligence.</h2>
            <p>BAELIX was created by two builders working toward AI that is useful, visible, and available to everyone.</p>
          </div>
          <div className="founder-list">
            <article><span>ND</span><div><h3>Nikhil Dhandhi</h3><p>Co-creator of BAELIX</p></div><Check size={18} /></article>
            <article><span>RC</span><div><h3>Rupesh Chauhan</h3><p>Co-creator of BAELIX</p></div><Check size={18} /></article>
          </div>
        </div>
      </section>

      <footer>
        <a className="brand" href="#top"><Image src="/baelix-signature.svg" alt="" width={38} height={38} /><span>BAELIX</span></a>
        <p>Automation is the future.</p>
        <p>© {new Date().getFullYear()} BAELIX · Nikhil Dhandhi &amp; Rupesh Chauhan</p>
      </footer>
    </main>
  );
}
