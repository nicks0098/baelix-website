'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Inbox,
  KeyRound,
  LogOut,
  RefreshCw,
  Search,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | FeedbackStatus>('all');

  async function loadFeedback(adminKey: string) {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/feedback/inbox', {
        headers: { Authorization: `Bearer ${adminKey}` },
        cache: 'no-store',
      });
      const body = await response.json() as { feedback?: FeedbackItem[]; message?: string };
      if (!response.ok) throw new Error(body.message || 'The feedback inbox could not be loaded.');
      setItems(body.feedback || []);
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
    setError('');
  }

  async function changeStatus(id: string, status: FeedbackStatus) {
    const previous = items;
    setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    try {
      const response = await fetch('/api/feedback/inbox', {
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
          <div><p className="inbox-kicker">PRIVATE OWNER SPACE</p><h1>Feedback inbox</h1></div>
          <div className="inbox-count"><Inbox size={19} /><strong>{newCount}</strong><span>new</span></div>
        </div>

        <div className="inbox-controls">
          <label className="inbox-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search feedback, email, or reference…" /></label>
          <div className="inbox-filters" aria-label="Filter feedback">
            {(['all', 'new', 'reviewing', 'resolved', 'archived'] as const).map((status) => (
              <button key={status} className={filter === status ? 'active' : ''} onClick={() => setFilter(status)}>{status}</button>
            ))}
          </div>
        </div>

        {error && <div className="inbox-error inbox-error-wide">{error}<button onClick={() => setError('')}>Dismiss</button></div>}

        <div className="inbox-table-card">
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
        </div>
      </section>
    </main>
  );
}

