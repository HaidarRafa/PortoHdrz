import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../tugas.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemen root aplikasi tugas tidak ditemukan.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
