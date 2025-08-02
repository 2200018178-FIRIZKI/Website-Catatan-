// Mengimpor data notes dari file lain
import { notesData } from './notes.js';  // Perbaiki path
import { showNotes } from './NoteItem.js';  // Perbaiki path

// Fungsi fallback jika showNotes tidak tersedia
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
        <button onclick="archiveNote('${note.id}')">Archive</button>
        <button onclick="deleteNote('${note.id}')">Delete</button>
      </div>
    `;
    container.appendChild(noteDiv);
  });
};

// Menentukan container untuk menampilkan notes
const notesContainer = document.getElementById('notes-container');

// Menampilkan semua notes di container
const displayNotes = () => {
  if (typeof showNotes === 'function' && notesContainer) {
    showNotes(notesData, notesContainer);  // Panggil fungsi showNotes untuk menampilkan notes
  } else if (notesContainer) {
    displayNotesLocal(notesData, notesContainer); // Fallback function
  }
};

// Menambahkan event listener jika ada interaksi seperti menambah, menghapus, atau mengarsipkan notes
const setupEventListeners = () => {
  // Misalnya, menambahkan event listener untuk tombol menambah note
  const addNoteButton = document.getElementById('add-note');
  addNoteButton.addEventListener('click', () => {
    // Logika untuk menambah note baru
    // Bisa menggunakan SweetAlert atau prompt untuk mendapatkan input
    const newNoteTitle = prompt('Enter the title of the new note:');  // Prompt for title
    const newNoteBody = prompt('Enter the body of the new note:');  // Prompt for body

    // Pastikan input tidak kosong
    if (newNoteTitle && newNoteBody) {
      const newNote = {
        id: 'notes-' + Date.now(),
        title: newNoteTitle,
        body: newNoteBody,
        createdAt: new Date().toISOString(),
        archived: false,
      };

      notesData.push(newNote);  // Menambahkan note ke dalam data
      displayNotes();  // Menampilkan ulang notes yang sudah diperbarui
    } else {
      alert('Both title and body are required to add a new note.');
    }
  });

  // Event listeners lainnya bisa ditambahkan di sini untuk menghapus atau mengarsipkan notes
  // Global functions untuk onclick handlers
  window.archiveNote = (noteId) => {
    const note = notesData.find(note => note.id === noteId);
    if (note) {
      note.archived = true;
      displayNotes();
    }
  };

  window.deleteNote = (noteId) => {
    const noteIndex = notesData.findIndex(note => note.id === noteId);
    if (noteIndex !== -1) {
      notesData.splice(noteIndex, 1);
      displayNotes();
    }
  };

  // Misalnya, event listener untuk menghapus note berdasarkan id
  const deleteNoteButton = document.getElementById('delete-note');
  if (deleteNoteButton) {
    deleteNoteButton.addEventListener('click', (event) => {
      const noteIdToDelete = event.target.getAttribute('data-id');
      window.deleteNote(noteIdToDelete);
    });
  }
};

// Menjalankan fungsi untuk setup dan menampilkan notes
const init = () => {
  displayNotes();  // Pertama kali menampilkan notes
  setupEventListeners();  // Mengatur event listeners
};

// Jalankan inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', init);

