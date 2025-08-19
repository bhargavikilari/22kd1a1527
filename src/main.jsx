import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Runtime check to enforce running only on http://localhost:3000
if (
  window.location.hostname !== "localhost" ||
  window.location.port !== "3000"
) {
  document.body.innerHTML = "<h1>This app must run on http://localhost:3000</h1>";
  throw new Error("Invalid host or port!");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

