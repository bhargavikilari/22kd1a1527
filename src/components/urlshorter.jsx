
import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'urlShortenerData';
const genKey = (l = 6) => [...Array(l)].map(() => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]).join('');

export default function UrlShortener() {
  const [input, setInput] = useState(''), [data, setData] = useState({}), [err, setErr] = useState('');
  useEffect(() => { const d = localStorage.getItem(LOCAL_STORAGE_KEY); if (d) setData(JSON.parse(d)); }, []);
  useEffect(() => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data)), [data]);

  const isValid = (url) => { try { new URL(url); return true; } catch { return false; } };
  const shorten = () => {
    setErr('');
    if (!input) return setErr('Enter a URL.');
    if (!isValid(input)) return setErr('Invalid URL.');
    if (Object.values(data).some(d => d.originalUrl === input)) return alert('Already shortened'), setInput('');
    let key; do { key = genKey(); } while (data[key]);
    setData({ ...data, [key]: { originalUrl: input, clicks: 0 } });
    setInput('');
  };
  const redirect = (key) => {
    const entry = data[key]; if (!entry) return;
    setData(p => ({ ...p, [key]: { ...entry, clicks: entry.clicks + 1 } }));
    window.open(entry.originalUrl, '_blank');
  };

  const base = window.location.origin;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔗 URL Shortener</h2>
        <div style={styles.row}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter URL" style={styles.input} />
          <button onClick={shorten} style={styles.button}>Shorten</button>
        </div>
        {err && <p style={styles.error}>{err}</p>}
        <h3 style={styles.subtitle}>📄 Shortened URLs</h3>
        {Object.keys(data).length === 0 ? <p style={styles.info}>No URLs yet.</p> : (
          <table style={styles.table}>
            <thead><tr><th>Short</th><th>Original</th><th>Clicks</th><th>Action</th></tr></thead>
            <tbody>
              {Object.entries(data).map(([k, { originalUrl, clicks }]) => (
                <tr key={k}>
                  <td><a href="#!" onClick={() => redirect(k)} style={styles.link}>{base}/{k}</a></td>
                  <td style={{ wordBreak: 'break-all' }}>{originalUrl}</td>
                  <td>{clicks}</td>
                  <td><button onClick={() => { const d = { ...data }; delete d[k]; setData(d); }} style={styles.delete}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { background: 'aliceblue', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' },
  card: { maxWidth: 800, margin: 'auto', padding: '2rem', background: 'pink', borderRadius: 10, boxShadow: '0 6px 12px gray' },
  title: { textAlign: 'center', marginBottom: 20, color: 'red' },
  row: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
  input: { flex: 1, padding: '0.75rem', border: '1px solid gray', borderRadius: 6 },
  button: { background: 'skyblue', color: 'darkblue', border: 'none', borderRadius: 6, padding: '0.75rem 1.5rem', cursor: 'pointer' },
  error: { color: 'deeppink' },
  subtitle: { color: 'slategray', marginTop: 30 },
  info: { color: 'gray' },
  table: { width: '100%', marginTop: 10, borderCollapse: 'collapse' },
  link: { color: 'blue', textDecoration: 'underline', cursor: 'pointer' },
  delete: { background: 'navy', color: 'white', border: 'none', borderRadius: 4, padding: '0.4rem 0.8rem', cursor: 'pointer' }
};
