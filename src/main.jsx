import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const API_BASE = import.meta.env.VITE_API_URL || '';
const origFetch = window.fetch;
window.fetch = (url, options) => {
  if (typeof url === 'string' && url.startsWith('/api/')) {
    if (API_BASE) url = API_BASE + url;
    const token = localStorage.getItem('token');
    if (token) {
      options = options || {};
      options.headers = options.headers || {};
      options.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return origFetch(url, options);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
