import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import AppState from './context/AppState.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <AppState>
    <App />
  </AppState>
);
