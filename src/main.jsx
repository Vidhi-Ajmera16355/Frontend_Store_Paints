import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import AppState from './context/AppState.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';


const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const root = createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AppState>
      <App />
    </AppState>
  </GoogleOAuthProvider>
);
