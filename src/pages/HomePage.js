// Mengimpor data notes dan showNotes dari file lain
import { notesData } from './notesdata';  // Pastikan path-nya sesuai
import { showNotes } from './notelist';  // Pastikan showNotes diimpor dari notelist.js

// Menentukan container untuk menampilkan notes di halaman utama
const homeContainer = document.getElementById('home-container');

// Fungsi untuk menyaring notes yang belum diarsipkan
const getActiveNotes = () => {
  return notesData.filter(note => !note.archived);  // Menyaring notes yang belum diarsipkan
};

// Fungsi untuk menampilkan notes yang belum diarsipkan di container
const displayActiveNotes = () => {
  const activeNotes = getActiveNotes();  // Ambil notes yang belum diarsipkan
  showNotes(activeNotes, homeContainer);  // Tampilkan notes yang belum diarsipkan
};

// Fungsi untuk mengarsipkan note berdasarkan id
const archiveNote = (noteId) => {
  const note = notesData.find(note => note.id === noteId);

  if (note) {
    note.archived = true;  // Set status archived menjadi true
    displayActiveNotes();  // Menampilkan ulang notes yang sudah diperbarui
  }
};

// Menambahkan event listener untuk mengarsipkan note menggunakan event delegation
const setupEventListeners = () => {
  homeContainer.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('archive-btn')) {
      const noteId = event.target.getAttribute('data-note-id');
      archiveNote(noteId);  // Memanggil fungsi untuk mengarsipkan note
    }
  });
};

// Menjalankan inisialisasi saat halaman siap
const init = () => {
  displayActiveNotes();  // Menampilkan notes yang belum diarsipkan
  setupEventListeners();  // Mengatur event listeners
};

// Jalankan inisialisasi saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', init);




