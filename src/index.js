import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './ThemeContext'; // ← ADD THIS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>   {/* ← ADD THIS */}
      <App />
    </ThemeProvider>  {/* ← ADD THIS */}
  </React.StrictMode>
);

reportWebVitals();