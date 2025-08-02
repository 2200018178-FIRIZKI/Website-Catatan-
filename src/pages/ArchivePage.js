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
        <button class="unarchive-btn" data-note-id="${note.id}">Unarchive</button>
        <button class="delete-btn" data-note-id="${note.id}">Delete</button>
      </div>
    `;
    container.appendChild(noteDiv);
  });
};

// Menentukan container untuk menampilkan notes yang diarsipkan
const archiveContainer = document.getElementById('archive-container') || document.getElementById('notes-grid');

// Fungsi untuk menyaring notes yang diarsipkan
const getArchivedNotes = () => {
  return notesData.filter(note => note.archived);  // Menyaring notes yang diarsipkan
};

// Fungsi untuk menampilkan notes yang diarsipkan di container
const displayArchivedNotes = () => {
  const archivedNotes = getArchivedNotes();  // Ambil notes yang diarsipkan
  if (typeof showNotes === 'function' && archiveContainer) {
    showNotes(archivedNotes, archiveContainer);  // Tampilkan notes yang diarsipkan
  } else if (archiveContainer) {
    displayNotesLocal(archivedNotes, archiveContainer); // Fallback
  }
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
  if (archiveContainer) {
    archiveContainer.addEventListener('click', (event) => {
      if (event.target && event.target.classList.contains('unarchive-btn')) {
        const noteId = event.target.getAttribute('data-note-id');
        unarchiveNote(noteId);  // Memanggil fungsi untuk mengembalikan note
      }
    });
  }
};

// Menjalankan inisialisasi saat halaman siap
const init = () => {
  displayArchivedNotes();  // Menampilkan notes yang sudah diarsipkan
  setupEventListeners();  // Mengatur event listeners
};

// Jalankan inisialisasi saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', init);



