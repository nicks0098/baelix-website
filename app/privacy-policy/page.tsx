import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy & Data Policy — BAELIX',
  description: 'How BAELIX handles download registration, product intelligence, local data, feedback, and connected AI services.',
};

export default function PrivacyPolicy() {
  return (
    <main className="policy-page">
      <header className="policy-header">
        <Link className="brand" href="/"><Image src="/baelix-signature.svg" alt="" width={40} height={40} /><span>BAELIX</span></Link>
        <Link href="/">Return to BAELIX</Link>
      </header>
      <article className="policy-document">
        <p className="policy-kicker">PRIVACY &amp; DATA POLICY</p>
        <h1>Intelligence with accountability.</h1>
        <p className="policy-effective">Effective September 8, 2026</p>
        <p className="policy-intro">This Privacy &amp; Data Policy explains how BAELIX collects, uses, protects, and gives you control over information associated with the BAELIX website and Windows application.</p>

        <section><h2>1. Scope</h2><p>This policy applies to the BAELIX website, installer distribution, in-app feedback, update services, and optional product-intelligence services. Third-party AI providers you choose to connect operate under their own privacy terms.</p></section>
        <section><h2>2. Information you provide</h2><p>Before downloading BAELIX, we collect your name and either an email address or mobile number. We use this information to administer downloads, communicate essential product and security updates, understand adoption, and support the BAELIX community. If you submit feedback, we collect the message, feedback type, optional reply address, app version, and any diagnostics you elect to include.</p></section>
        <section><h2>3. Product intelligence</h2><p>BAELIX includes an optional Product Intelligence program designed to improve reliability, response speed, routing quality, and feature planning. If you affirmatively enable it, BAELIX may transmit the text of requests you enter, the selected operating mode, whether automation was enabled, response duration, app version, and completion outcome. Product Intelligence does not include uploaded attachments, document or image contents, credentials, provider tokens, generated model responses, or files in your workspace. You can disable Product Intelligence at any time in Settings.</p></section>
        <section><h2>4. Information that remains local</h2><p>BAELIX chat history, project records, task checkpoints, and local application memory are stored on your Windows device. New installations begin with a clean local history. Provider credentials are stored using protected operating-system facilities and are not sent to BAELIX.</p></section>
        <section><h2>5. Connected intelligence providers</h2><p>When you connect OpenRouter, OpenAI, Cloudflare, or another intelligence provider, requests necessary to deliver the selected service are transmitted to that provider. BAELIX does not control a provider’s independent processing. Review the provider’s terms and privacy policy before connecting it.</p></section>
        <section><h2>6. How information is used</h2><ul><li>Deliver and maintain downloads, updates, and support.</li><li>Measure reliability, latency, capacity, and feature performance.</li><li>Diagnose defects, prevent misuse, and protect service integrity.</li><li>Improve model routing and prioritize product improvements.</li><li>Communicate material product, privacy, or security information.</li></ul><p>BAELIX does not sell personal information or use it for third-party advertising.</p></section>
        <section><h2>7. Legal grounds and choice</h2><p>We process download registration information to provide the requested software and related service communications. Product Intelligence is based on your consent. You may decline it without losing access to BAELIX’s core functionality, and you may change your choice later.</p></section>
        <section><h2>8. Retention and security</h2><p>We retain information only for as long as reasonably necessary for the purposes described here, legal obligations, security, and dispute resolution. We use access controls, encrypted transport, restricted administrative access, and service-level protections. No system can guarantee absolute security.</p></section>
        <section><h2>9. Your choices and requests</h2><p>You may disable Product Intelligence in BAELIX Settings, remove local chat history within the application, disconnect providers, and ask the BAELIX team through in-app feedback to access, correct, or delete information associated with your contact details.</p></section>
        <section><h2>10. Children</h2><p>BAELIX is not directed to children under 13, and we do not knowingly collect their personal information.</p></section>
        <section><h2>11. Changes</h2><p>We may update this policy as BAELIX evolves. Material changes will be identified through the website, application, or update channel, with a revised effective date.</p></section>
        <section><h2>12. Contact</h2><p>Use the Feedback control in BAELIX to submit a privacy request or contact the BAELIX team. Include the email address or mobile number used during download so the request can be verified.</p></section>
      </article>
    </main>
  );
}
