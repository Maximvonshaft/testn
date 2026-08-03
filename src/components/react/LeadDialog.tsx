import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import type { Locale } from '@/data/catalog';
import type { SiteCopy } from '@/data/copy';
import styles from './LeadDialog.module.css';

type Props = { locale: Locale; copy: SiteCopy; turnstileSiteKey?: string | undefined };
type Selection = { system: string; material: string };
type TurnstileApi = { render: (node: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void; 'error-callback': () => void; theme: 'light' }) => string; reset: (id: string) => void };
declare global { interface Window { turnstile?: TurnstileApi; } }

export default function LeadDialog({ locale, copy, turnstileSiteKey }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<{ state: 'idle' | 'sending' | 'success' | 'error'; text: string }>({ state: 'idle', text: turnstileSiteKey ? '' : copy.form.unavailable });
  const [selection, setSelection] = useState<Selection>({ system: copy.systems.bathroom.label, material: 'Bianco Lumen' });
  const [turnstileToken, setTurnstileToken] = useState('');
  const challengeRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const formId = useId();

  useEffect(() => {
    const opener = (event: Event) => {
      const target = event.target as Element | null;
      if (target?.closest('[data-open-lead]')) setOpen(true);
    };
    const selectionHandler = (event: Event) => {
      const detail = (event as CustomEvent<Selection>).detail;
      if (detail?.material) setSelection(detail);
    };
    document.addEventListener('click', opener);
    window.addEventListener('aquastone:selection', selectionHandler);
    return () => { document.removeEventListener('click', opener); window.removeEventListener('aquastone:selection', selectionHandler); };
  }, []);

  useEffect(() => {
    if (!open || !turnstileSiteKey || !challengeRef.current) return;
    let cancelled = false;
    const render = () => {
      if (cancelled || !window.turnstile || !challengeRef.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(challengeRef.current, {
        sitekey: turnstileSiteKey,
        theme: 'light',
        callback: setTurnstileToken,
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => { setTurnstileToken(''); setStatus({ state: 'error', text: copy.form.error }); },
      });
    };
    render();
    const timer = window.setInterval(render, 250);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [open, turnstileSiteKey, copy.form.error]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    document.body.dataset.lock = String(next);
    if (!next) {
      setStatus({ state: 'idle', text: turnstileSiteKey ? '' : copy.form.unavailable });
      setTurnstileToken('');
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!turnstileSiteKey || !turnstileToken) { setStatus({ state: 'error', text: copy.form.unavailable }); return; }
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = {
      name: String(values.get('name') ?? ''), email: String(values.get('email') ?? ''), company: String(values.get('company') ?? ''), country: String(values.get('country') ?? ''),
      projectType: String(values.get('projectType') ?? ''), application: String(values.get('application') ?? ''), finishes: String(values.get('finishes') ?? selection.material), message: String(values.get('message') ?? ''),
      consent: values.get('consent') === 'on', locale, website: String(values.get('website') ?? ''), turnstileToken,
    };
    setStatus({ state: 'sending', text: copy.form.sending });
    try {
      const response = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`Lead endpoint returned ${response.status}`);
      setStatus({ state: 'success', text: copy.form.success });
      form.reset();
      window.dispatchEvent(new CustomEvent('aquastone:lead-success'));
    } catch {
      setStatus({ state: 'error', text: copy.form.error });
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
      setTurnstileToken('');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Viewport className={styles.viewport}>
          <Dialog.Popup className={styles.popup}>
            <Dialog.Close className={styles.close} aria-label={copy.actions.close}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 6 12 12M18 6 6 18"/></svg></Dialog.Close>
            <div className={styles.grid}>
              <div className={styles.intro}>
                <p className={`eyebrow ${styles.eyebrow}`}>{copy.form.eyebrow}</p>
                <Dialog.Title className={styles.title}>{copy.form.title}</Dialog.Title>
                <Dialog.Description>{copy.form.intro}</Dialog.Description>
                <div className={styles.selected}><strong>{selection.material}</strong><br/><span>{selection.system}</span></div>
              </div>
              <form id={formId} className={styles.form} onSubmit={submit} noValidate={false}>
                <label className={styles.honeypot}>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
                <div className={styles.formGrid}>
                  <label className={styles.field}><span>{copy.form.fields.name} *</span><input name="name" autoComplete="name" required minLength={2} maxLength={120}/></label>
                  <label className={styles.field}><span>{copy.form.fields.email} *</span><input name="email" type="email" autoComplete="email" required maxLength={180}/></label>
                  <label className={styles.field}><span>{copy.form.fields.company}</span><input name="company" autoComplete="organization" maxLength={180}/></label>
                  <label className={styles.field}><span>{copy.form.fields.country} *</span><input name="country" autoComplete="country-name" required minLength={2} maxLength={120}/></label>
                  <label className={styles.field}><span>{copy.form.fields.projectType} *</span><select name="projectType" required defaultValue=""><option value="" disabled>{copy.form.select}</option>{copy.form.projectTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label className={styles.field}><span>{copy.form.fields.application} *</span><select name="application" required defaultValue={copy.systems.bathroom.label}>{Object.values(copy.systems).map((item) => <option key={item.label}>{item.label}</option>)}</select></label>
                  <label className={`${styles.field} ${styles.full}`}><span>{copy.form.fields.finishes}</span><input name="finishes" defaultValue={selection.material} key={selection.material} maxLength={240}/></label>
                  <label className={`${styles.field} ${styles.full}`}><span>{copy.form.fields.message}</span><textarea name="message" maxLength={1500}/></label>
                </div>
                <label className={styles.consent}><input name="consent" type="checkbox" required/><span>{copy.form.fields.privacy} *</span></label>
                <div ref={challengeRef} className={styles.challenge} aria-label="Anti-spam verification" />
                <div className={styles.actions}><p className={styles.status} data-state={status.state} role="status" aria-live="polite">{status.text}</p><button className={`button button--dark ${styles.submit}`} disabled={status.state === 'sending' || !turnstileSiteKey} type="submit">{copy.actions.submit} →</button></div>
              </form>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
