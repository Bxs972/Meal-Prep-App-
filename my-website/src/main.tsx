// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // ⚡ ton fichier Tailwind ou global CSS

// On cible l'élément #root dans index.html
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Impossible de trouver l'élément #root dans index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
