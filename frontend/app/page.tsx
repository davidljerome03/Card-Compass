'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <main className={styles.main}>
      {/* Background Elements */}
      <div className={styles.backgroundBlobs}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
      </div>

      <div className={styles.glassPanel}>
        {/* Header / Logo */}
        <div className={styles.header}>
          <img src="/logo.png" alt="Card Compass" className={styles.logo} />
          <p className={styles.subtitle}>
            Maximize your rewards with AI-powered recommendations.
          </p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              placeholder="demo@example.com"
              className="input-field"
              defaultValue="demo@example.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-field"
              defaultValue="password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Signing In...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Sign In <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Don&apos;t have an account? <span className={styles.link}>Sign up</span>
          </p>
        </div>
      </div>
    </main>
  );
}
