// File: frontend/src/App.js
import { resolveRoute } from './utils/router.js';
import { isLoggedIn } from './utils/auth.js';
import Header from './components/Header.js';
import Sidebar from './components/Sidebar.js';

const App = async () => {
  const appContainer = document.querySelector('#app');
  
  if (!isLoggedIn() && location.pathname !== '/register') {
      // Jika belum login dan bukan di halaman register, paksa ke login
      if (location.pathname !== '/login') {
          history.pushState(null, null, '/login');
      }
  }

  const page = await resolveRoute();

  if (isLoggedIn()) {
    // Tampilan untuk pengguna yang sudah login (dengan layout)
    appContainer.innerHTML = `
      <div>
        ${await Sidebar()}
        <div class="md:pl-64 flex flex-col flex-1">
          ${await Header()}
          <main class="flex-1">
            <div class="py-6">
              <div id="page-content" class="px-4 sm:px-6 md:px-8">
                </div>
            </div>
          </main>
        </div>
      </div>
    `;
    document.getElementById('page-content').innerHTML = page.render();
    if (page.after_render) await page.after_render();
  } else {
    // Tampilan untuk login & register (tanpa layout)
    appContainer.innerHTML = page.render();
    if (page.after_render) await page.after_render();
  }
};

export default App;

