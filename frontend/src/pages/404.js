const NotFoundPage = {
  render: () => {
    return `
      <div class="flex flex-col items-center justify-center bg-gray-50 px-4 py-12 lg:px-8 h-screen w-screen sm:py-0 sm:px-0 m-0">
        <div class="text-center max-w-md w-full">
          
          <!-- SVG Illustration: A friendly "lost" icon -->
          <svg class="mx-auto h-32 w-32 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v.01M15 15h.01M9 15h.01M12 12a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
          
          <p class="text-6xl font-extrabold text-indigo-600 mt-6">404</p>
          <h1 class="mt-2 text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">Halaman Tidak Ditemukan</h1>
          <p class="mt-4 text-base text-gray-500">Maaf, kami tidak dapat menemukan halaman yang Anda cari.</p>
          
          <div class="mt-10">
            <a href="/" data-link class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    `;
  },
  after_render: () => {
    // Tidak ada JavaScript spesifik yang diperlukan untuk halaman statis ini
  },
};

export default NotFoundPage;