// Alamat base URL API backend
export const API_URL = 'http://localhost:5000/api';

/**
 * Fungsi fetch yang sudah dikonfigurasi dengan header otentikasi.
 * @param {string} url - URL endpoint API (tanpa base URL).
 * @param {object} options - Opsi untuk fetch (method, body, dll).
 * @param {string} token - Token JWT.
 * @returns {Promise<any>} - Hasil dari response JSON.
 */
export const apiRequest = async (url, options = {}, token) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${url}`, { ...options, headers });
        const data = await response.json();

        if (!response.ok) {
            // Melempar error agar bisa ditangkap di .catch()
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error; // Lempar ulang error agar bisa dihandle di pemanggil
    }
};

// Fungsi untuk menampilkan notifikasi sederhana
export const showNotification = (message, isError = false) => {
    alert(message);
    // Di aplikasi nyata, ini bisa diganti dengan library notifikasi yang lebih baik
    // seperti Toastify, Noty, dll.
};

// Fungsi untuk format tanggal
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}