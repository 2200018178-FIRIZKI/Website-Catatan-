// Fungsi untuk format tanggal menjadi format lokal
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString(undefined, options); // You can replace 'undefined' with a specific locale, e.g., 'en-US'
};

// Fungsi untuk memeriksa apakah sebuah string valid (misalnya, untuk title dan body note)
export const isValidNote = (title, body) => {
  return title.trim() !== '' && body.trim() !== '' && title.length > 3 && body.length > 5; // Minimum length for title and body
};

// Fungsi untuk menyimpan data ke localStorage (untuk keperluan cache)
export const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Fungsi untuk mengambil data dari localStorage
export const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];  // Return an empty array if no data is found
};

// Fungsi untuk menghapus data dari localStorage
export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

  