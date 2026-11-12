import { FormEvent, useState } from 'react';
import { useSpoilers } from '@/lib/SpoilerContext';
import styles from './SpoilerGate.module.css';

export default function SpoilerGate() {
  const { unlocked, checking, unlock, lock } = useSpoilers();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  if (checking) return null;

  if (unlocked) {
    return (
      <div className={styles.gate}>
        <span>Spoilers unlocked</span>
        <button type="button" className={styles.link} onClick={lock}>Lock</button>
      </div>
    );
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await unlock(password);
    setBusy(false);
    setError(!ok);
    if (ok) setPassword('');
  };

  return (
    <form className={styles.gate} onSubmit={submit}>
      <span>Spoilers hidden</span>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="password"
        className={styles.input}
        aria-label="Spoiler password"
      />
      <button type="submit" className={styles.link} disabled={busy || !password}>Unlock</button>
      {error && <span className={styles.error}>Incorrect password</span>}
    </form>
  );
}
