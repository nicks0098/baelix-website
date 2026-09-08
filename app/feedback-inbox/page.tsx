'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Inbox,
  Gauge,
  KeyRound,
  LogOut,
  RefreshCw,
  Search,
  UsersRound,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type FeedbackStatus = 'new' | 'reviewing' | 'resolved' | 'archived';
type FeedbackItem = {
  id: string;
  kind: 'bug' | 'idea' | 'compliment';
  message: string;
  contactEmail: string | null;
  appVersion: string;
  platform: string | null;
  architecture: string | null;
  status: FeedbackStatus;
  createdAt: string;
};
type DownloadItem = { id: string; name: string; contactKind: 'email' | 'mobile'; contactValue: string; createdAt: string };
type PromptItem = { id: string; installationId: string; prompt: string; mode: 'free' | 'connected'; automation: number; appVersion: string; latencyMs: number | null; outcome: string; createdAt: string };
type InboxView = 'feedback' | 'downloads' | 'intelligence';

const STORAGE_KEY = 'baelix-feedback-inbox-key';

function readableDate(value: string) {
  const normalized = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function FeedbackInbox() {
  const [key, setKey] = useState('');
  const [draftKey, setDraftKey] = useState('');
  const [remember, setRemember] = useState(true);
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [view, setView] = useState<InboxView>('feedback');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | FeedbackStatus>('all');

  async function loadFeedback(adminKey: string) {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/feedback-inbox', {
        headers: { Authorization: `Bearer ${adminKey}` },
        cache: 'no-store',
      });
      const body = await response.json() as { feedback?: FeedbackItem[]; downloads?: DownloadItem[]; prompts?: PromptItem[]; message?: string };
      if (!response.ok) throw new Error(body.message || 'The feedback inbox could not be loaded.');
      setItems(body.feedback || []);
      setDownloads(body.downloads || []);
      setPrompts(body.prompts || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) || '';
    if (saved) {
      setKey(saved);
      setDraftKey(saved);
      void loadFeedback(saved);
    }
  }, []);

  function unlock(event: FormEvent) {
    event.preventDefault();
    const value = draftKey.trim();
    if (!value) return;
    setKey(value);
    if (remember) window.localStorage.setItem(STORAGE_KEY, value);
    else window.localStorage.removeItem(STORAGE_KEY);
    void loadFeedback(value);
  }

  function lock() {
    window.localStorage.removeItem(STORAGE_KEY);
    setKey('');
    setDraftKey('');
    setItems([]);
    setDownloads([]);
    setPrompts([]);
    setError('');
  }

  async function changeStatus(id: string, status: FeedbackStatus) {
    const previous = items;
    setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    try {
      const response = await fetch('/api/feedback-inbox', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });
      const body = await response.json() as { message?: string };
      if (!response.ok) throw new Error(body.message || 'The status could not be saved.');
    } catch (updateError) {
      setItems(previous);
      setError(updateError instanceof Error ? updateError.message : String(updateError));
    }
  }

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== 'all' && item.status !== filter) return false;
      if (!needle) return true;
      return [item.id, item.kind, item.message, item.contactEmail, item.appVersion]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle));
    });
  }, [filter, items, query]);

  const newCount = items.filter((item) => item.status === 'new').length;
  const visibleDownloads = downloads.filter((item) => !query.trim() || [item.id, item.name, item.contactValue].some((value) => value.toLowerCase().includes(query.trim().toLowerCase())));
  const visiblePrompts = prompts.filter((item) => !query.trim() || [item.prompt, item.mode, item.outcome, item.appVersion].some((value) => value.toLowerCase().includes(query.trim().toLowerCase())));

  if (!key) {
    return (
      <main className="inbox-login-shell">
        <a className="inbox-back" href="/"><ArrowLeft size={17} /> BAELIX website</a>
        <form className="inbox-login" onSubmit={unlock}>
          <Image src="/baelix-signature.svg" alt="" width={58} height={58} priority />
          <p className="inbox-kicker">PRIVATE OWNER SPACE</p>
          <h1>Feedback inbox</h1>
          <p>Enter the private inbox key. Feedback is never shown on the public website.</p>
          <label>
            <span>Inbox key</span>
            <div className="inbox-key-field"><KeyRound size={18} /><input type="password" value={draftKey} onChange={(event) => setDraftKey(event.target.value)} autoComplete="current-password" autoFocus /></div>
          </label>
          <label className="inbox-remember"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Remember on this computer</label>
          {error && <div className="inbox-error">{error}</div>}
          <button type="submit">Open inbox</button>
        </form>
      </main>
    );
  }

  return (
    <main className="feedback-inbox-shell">
      <header className="inbox-header">
        <a className="brand" href="/"><Image src="/baelix-signature.svg" alt="" width={40} height={40} /><span>BAELIX</span></a>
        <div className="inbox-header-actions">
          <button onClick={() => void loadFeedback(key)} disabled={loading}><RefreshCw size={16} className={loading ? 'spinning' : ''} /> Refresh</button>
          <button onClick={lock}><LogOut size={16} /> Lock inbox</button>
        </div>
      </header>

      <section className="inbox-content">
        <div className="inbox-title-row">
          <div><p className="inbox-kicker">PRIVATE OWNER SPACE</p><h1>BAELIX intelligence</h1></div>
          <div className="inbox-count"><Inbox size={19} /><strong>{newCount}</strong><span>new feedback</span></div>
        </div>

        <div className="inbox-views" role="tablist">
          <button className={view === 'feedback' ? 'active' : ''} onClick={() => setView('feedback')}><Inbox size={17} /> Feedback <span>{items.length}</span></button>
          <button className={view === 'downloads' ? 'active' : ''} onClick={() => setView('downloads')}><UsersRound size={17} /> Downloads <span>{downloads.length}</span></button>
          <button className={view === 'intelligence' ? 'active' : ''} onClick={() => setView('intelligence')}><Gauge size={17} /> Product intelligence <span>{prompts.length}</span></button>
        </div>

        <div className="inbox-controls">
          <label className="inbox-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${view === 'feedback' ? 'feedback' : view === 'downloads' ? 'downloads' : 'product intelligence'}…`} /></label>
          {view === 'feedback' && <div className="inbox-filters" aria-label="Filter feedback">
            {(['all', 'new', 'reviewing', 'resolved', 'archived'] as const).map((status) => (
              <button key={status} className={filter === status ? 'active' : ''} onClick={() => setFilter(status)}>{status}</button>
            ))}
          </div>}
        </div>

        {error && <div className="inbox-error inbox-error-wide">{error}<button onClick={() => setError('')}>Dismiss</button></div>}

        {view === 'feedback' && <div className="inbox-table-card">
          {loading && items.length === 0 ? (
            <div className="inbox-empty"><RefreshCw className="spinning" /> Loading feedback…</div>
          ) : visibleItems.length === 0 ? (
            <div className="inbox-empty"><CheckCircle2 /> No feedback matches this view.</div>
          ) : (
            <Table className="feedback-table">
              <TableHeader><TableRow><TableHead>Received</TableHead><TableHead>Type</TableHead><TableHead>Message</TableHead><TableHead>Contact</TableHead><TableHead>Version</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {visibleItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell><time>{readableDate(item.createdAt)}</time><small>{item.id}</small></TableCell>
                    <TableCell><span className={`feedback-kind-badge kind-${item.kind}`}>{item.kind}</span></TableCell>
                    <TableCell className="feedback-message-cell">{item.message}</TableCell>
                    <TableCell>{item.contactEmail ? <a href={`mailto:${item.contactEmail}`}>{item.contactEmail}</a> : <span className="muted">Not provided</span>}</TableCell>
                    <TableCell><strong>{item.appVersion}</strong><small>{[item.platform, item.architecture].filter(Boolean).join(' · ') || 'No diagnostics'}</small></TableCell>
                    <TableCell>
                      <select value={item.status} onChange={(event) => void changeStatus(item.id, event.target.value as FeedbackStatus)} aria-label={`Status for ${item.id}`}>
                        <option value="new">New</option><option value="reviewing">Reviewing</option><option value="resolved">Resolved</option><option value="archived">Archived</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>}
        {view === 'downloads' && <div className="inbox-table-card">
          {visibleDownloads.length === 0 ? <div className="inbox-empty"><CheckCircle2 /> No download registrations match this view.</div> : (
            <Table className="feedback-table"><TableHeader><TableRow><TableHead>Registered</TableHead><TableHead>Name</TableHead><TableHead>Contact method</TableHead><TableHead>Contact</TableHead></TableRow></TableHeader><TableBody>
              {visibleDownloads.map((item) => <TableRow key={item.id}><TableCell><time>{readableDate(item.createdAt)}</time><small>{item.id}</small></TableCell><TableCell><strong>{item.name}</strong></TableCell><TableCell><span className="feedback-kind-badge">{item.contactKind}</span></TableCell><TableCell>{item.contactKind === 'email' ? <a href={`mailto:${item.contactValue}`}>{item.contactValue}</a> : <a href={`tel:${item.contactValue}`}>{item.contactValue}</a>}</TableCell></TableRow>)}
            </TableBody></Table>
          )}
        </div>}
        {view === 'intelligence' && <div className="inbox-table-card">
          {visiblePrompts.length === 0 ? <div className="inbox-empty"><CheckCircle2 /> No Product Intelligence records match this view.</div> : (
            <Table className="feedback-table"><TableHeader><TableRow><TableHead>Received</TableHead><TableHead>Request</TableHead><TableHead>Mode</TableHead><TableHead>Speed</TableHead><TableHead>Outcome</TableHead></TableRow></TableHeader><TableBody>
              {visiblePrompts.map((item) => <TableRow key={item.id}><TableCell><time>{readableDate(item.createdAt)}</time><small>{item.installationId.slice(0, 8)} · v{item.appVersion}</small></TableCell><TableCell className="feedback-message-cell">{item.prompt}</TableCell><TableCell><strong>{item.mode}</strong><small>{item.automation ? 'Automation' : 'Chat'}</small></TableCell><TableCell>{item.latencyMs === null ? '—' : `${(item.latencyMs / 1000).toFixed(1)}s`}</TableCell><TableCell><span className={`telemetry-outcome outcome-${item.outcome}`}>{item.outcome}</span></TableCell></TableRow>)}
            </TableBody></Table>
          )}
        </div>}
      </section>
    </main>
  );
}
