// Mengimpor data notes dan showNotes dari file lain
import { notesData } from './notesdata';  // Pastikan path-nya sesuai
import { showNotes } from './notelist';  // Pastikan showNotes diimpor dari notelist.js

// Menentukan container untuk menampilkan notes yang diarsipkan
const archiveContainer = document.getElementById('archive-container');

// Fungsi untuk menyaring notes yang diarsipkan
const getArchivedNotes = () => {
  return notesData.filter(note => note.archived);  // Menyaring notes yang diarsipkan
};

// Fungsi untuk menampilkan notes yang diarsipkan di container
const displayArchivedNotes = () => {
  const archivedNotes = getArchivedNotes();  // Ambil notes yang diarsipkan
  showNotes(archivedNotes, archiveContainer);  // Tampilkan notes yang diarsipkan
};

// Fungsi untuk mengembalikan note ke daftar utama
const unarchiveNote = (noteId) => {
  const note = notesData.find(note => note.id === noteId);

  if (note) {
    note.archived = false;  // Set status archived menjadi false
    displayArchivedNotes();  // Menampilkan ulang notes yang sudah diperbarui
  }
};

// Menambahkan event listener untuk mengembalikan note ke daftar utama menggunakan event delegation
const setupEventListeners = () => {
  // Event delegation untuk tombol "unarchive"
  archiveContainer.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('unarchive-btn')) {
      const noteId = event.target.getAttribute('data-note-id');
      unarchiveNote(noteId);  // Memanggil fungsi untuk mengembalikan note
    }
  });
};

// Menjalankan inisialisasi saat halaman siap
const init = () => {
  displayArchivedNotes();  // Menampilkan notes yang sudah diarsipkan
  setupEventListeners();  // Mengatur event listeners
};

// Jalankan inisialisasi saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', init);



