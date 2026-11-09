import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './app/App.jsx';
import { LocaleProvider } from './lib/i18n.jsx';
import './styles/tokens.css';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </HashRouter>
  </StrictMode>,
);
