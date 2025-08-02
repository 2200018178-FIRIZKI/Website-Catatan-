// Mengimpor data notes dan showNotes dari file lain
import { notesData } from '../components/notes.js';  // Perbaiki path
import { showNotes } from '../components/NoteItem.js';  // Perbaiki path

// Fallback function jika showNotes tidak tersedia
const displayNotesLocal = (notes, container) => {
  if (!container) return;
  
  container.innerHTML = '';
  
  notes.forEach(note => {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note-item';
    noteDiv.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.body}</p>
      <small>Created: ${new Date(note.createdAt).toLocaleDateString()}</small>
      <div class="note-actions">
        <button class="archive-btn" data-note-id="${note.id}">Archive</button>
        <button class="delete-btn" data-note-id="${note.id}">Delete</button>
      </div>
    `;
    container.appendChild(noteDiv);
  });
};

// Menentukan container untuk menampilkan notes di halaman utama
const homeContainer = document.getElementById('home-container') || document.getElementById('notes-grid');

// Fungsi untuk menyaring notes yang belum diarsipkan
const getActiveNotes = () => {
  return notesData.filter(note => !note.archived);  // Menyaring notes yang belum diarsipkan
};

// Fungsi untuk menampilkan notes yang belum diarsipkan di container
const displayActiveNotes = () => {
  const activeNotes = getActiveNotes();  // Ambil notes yang belum diarsipkan
  if (typeof showNotes === 'function' && homeContainer) {
    showNotes(activeNotes, homeContainer);  // Tampilkan notes yang belum diarsipkan
  } else if (homeContainer) {
    displayNotesLocal(activeNotes, homeContainer); // Fallback
  }
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
  if (homeContainer) {
    homeContainer.addEventListener('click', (event) => {
      if (event.target && event.target.classList.contains('archive-btn')) {
        const noteId = event.target.getAttribute('data-note-id');
        archiveNote(noteId);  // Memanggil fungsi untuk mengarsipkan note
      }
    });
  }
};

// Menjalankan inisialisasi saat halaman siap
const init = () => {
  displayActiveNotes();  // Menampilkan notes yang belum diarsipkan
  setupEventListeners();  // Mengatur event listeners
};

// Jalankan inisialisasi saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', init);




