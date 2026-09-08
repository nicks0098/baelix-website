'use client';

import { FormEvent, ReactNode, useState } from 'react';
import { Check, Download, Mail, Phone, ShieldCheck, UserRound, X } from 'lucide-react';

type ContactKind = 'email' | 'mobile';

interface DownloadGateProps {
  className?: string;
  children?: ReactNode;
}

export function DownloadGate({ className = 'primary-button', children }: DownloadGateProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [contactKind, setContactKind] = useState<ContactKind>('email');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function beginDownload(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/download/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contactKind, contact }),
      });
      const body = await response.json() as { downloadUrl?: string; message?: string };
      if (!response.ok || !body.downloadUrl) throw new Error(body.message || 'The download could not be started.');
      window.location.assign(body.downloadUrl);
      setOpen(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The download could not be started.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children || <><Download size={18} /> Download for Windows</>}
      </button>
      {open && (
        <div className="download-modal-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <section className="download-modal" role="dialog" aria-modal="true" aria-labelledby="download-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="download-modal-head">
              <div><p>BEFORE YOU DOWNLOAD</p><h2 id="download-title">Meet your BAELIX.</h2></div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <p className="download-modal-copy">Tell us who is joining the BAELIX community. We use these details for essential download and product-update communication.</p>
            <form onSubmit={beginDownload}>
              <label><span><UserRound size={15} /> Name</span><input autoFocus required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" /></label>
              <div className="contact-kind" role="radiogroup" aria-label="Contact method">
                <button type="button" className={contactKind === 'email' ? 'active' : ''} onClick={() => { setContactKind('email'); setContact(''); }}><Mail size={15} /> Email</button>
                <button type="button" className={contactKind === 'mobile' ? 'active' : ''} onClick={() => { setContactKind('mobile'); setContact(''); }}><Phone size={15} /> Mobile number</button>
              </div>
              <label><span>{contactKind === 'email' ? <><Mail size={15} /> Email address</> : <><Phone size={15} /> Mobile number</>}</span><input required maxLength={contactKind === 'email' ? 254 : 24} type={contactKind === 'email' ? 'email' : 'tel'} value={contact} onChange={(event) => setContact(event.target.value)} placeholder={contactKind === 'email' ? 'you@example.com' : '+91 98765 43210'} autoComplete={contactKind === 'email' ? 'email' : 'tel'} /></label>
              <div className="download-privacy"><ShieldCheck size={18} /><p><strong>Your chats are not collected by this form.</strong> BAELIX asks separately inside the app before any prompt text is shared for product improvement. Files, file contents, credentials, and AI replies are never included.</p></div>
              {error && <p className="download-error">{error}</p>}
              <button className="download-submit" disabled={submitting}>{submitting ? 'Preparing download…' : <><Check size={17} /> Continue to download</>}</button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
