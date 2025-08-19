import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'urlShortenerData';
const createShortId = (length = 6) => [...Array(length)].map(() => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]).join('');

export default function UrlShortener() {
  const [input, setInput] = useState('');
  const [urlMap, setUrlMap] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) setUrlMap(JSON.parse(storedData));
  }, []);

  useEffect(() => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(urlMap)), [urlMap]);

  const validateUrl = (url) => {
    try { new URL(url); return true; } catch { return false; }
  };

  const shortenUrl = () => {
    setError('');
    if (!input) return setError('Enter a URL.');
    if (!validateUrl(input)) return setError('Invalid URL.');
    if (Object.values(urlMap).some(e => e.originalUrl === input)) {
      alert('Already shortened');
      return setInput('');
    }
    let shortId;
    do { shortId = createShortId(); } while (urlMap[shortId]);
    setUrlMap({ ...urlMap, [shortId]: { originalUrl: input, clicks: 0 } });
    setInput('');
  };

  const redirectUrl = (shortId) => {
    const entry = urlMap[shortId];
    if (!entry) return;
    setUrlMap(prev => ({ ...prev, [shortId]: { ...entry, clicks: entry.clicks + 1 } }));
    window.open(entry.originalUrl, '_blank');
  };

  const base = window.location.origin;

  const totalUrls = Object.keys(urlMap).length;
  const totalClicks = Object.values(urlMap).reduce((sum, e) => sum + e.clicks, 0);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: 'auto', padding: '2rem', background: '#fff', borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#646cff' }}>🔗 URL Shortener</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter URL" style={{ flex: 1, padding: '0.75rem', border: '1px solid #ccc', borderRadius: 10 }} />
          <button onClick={shortenUrl} style={{ backgroundColor: '#646cff', color: '#fff', border: 'none', borderRadius: 10, padding: '0.75rem 1.5rem', cursor: 'pointer' }}>Shorten</button>
        </div>
        {error && <p style={{ color: '#ff4d6d' }}>{error}</p>}

        <h3 style={{ marginTop: 30, color: '#888' }}>📄 Shortened URLs</h3>
        {totalUrls === 0 ? <p style={{ color: '#888' }}>No URLs yet.</p> : (
          <table style={{ width: '100%', marginTop: 10, borderCollapse: 'collapse' }}>
            <thead><tr><th>Short</th><th>Original</th><th>Clicks</th><th>Action</th></tr></thead>
            <tbody>
              {Object.entries(urlMap).map(([k, { originalUrl, clicks }]) => (
                <tr key={k}>
                  <td><a href="#!" onClick={() => redirectUrl(k)} style={{ color: '#646cff', textDecoration: 'underline', cursor: 'pointer' }}>{base}/{k}</a></td>
                  <td style={{ wordBreak: 'break-all' }}>{originalUrl}</td>
                  <td>{clicks}</td>
                  <td><button onClick={() => { const copy = { ...urlMap }; delete copy[k]; setUrlMap(copy); }} style={{ backgroundColor: '#ff4d6d', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4rem 0.8rem', cursor: 'pointer' }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h3 style={{ marginTop: 30, color: '#646cff' }}>📊 Statistics</h3>
        <p>Total URLs: {totalUrls}</p>
        <p>Total Clicks: {totalClicks}</p>
      </div>
    </div>
  );
}
