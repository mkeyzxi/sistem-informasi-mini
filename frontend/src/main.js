import App from './App.js';
import { navigateTo } from './utils/router.js';

// Render the app on initial load
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', e => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  App();
});

// Re-render on browser navigation (back/forward)
window.addEventListener('popstate', App);