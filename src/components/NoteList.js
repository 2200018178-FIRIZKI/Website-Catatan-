// Mengimpor data notes dari file lain
import { notesData } from './notes';  // Pastikan path-nya sesuai

// Menentukan container untuk menampilkan notes
const notesContainer = document.getElementById('notes-container');

// Menampilkan semua notes di container
const displayNotes = () => {
  showNotes(notesData, notesContainer);  // Panggil fungsi showNotes untuk menampilkan notes
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
  // Misalnya, event listener untuk menghapus note berdasarkan id
  const deleteNoteButton = document.getElementById('delete-note');
  deleteNoteButton.addEventListener('click', (event) => {
    const noteIdToDelete = event.target.getAttribute('data-id');
    const noteIndex = notesData.findIndex(note => note.id === noteIdToDelete);
    if (noteIndex !== -1) {
      notesData.splice(noteIndex, 1);  // Hapus note berdasarkan id
      displayNotes();  // Tampilkan ulang notes setelah penghapusan
    }
  });
};

// Menjalankan fungsi untuk setup dan menampilkan notes
const init = () => {
  displayNotes();  // Pertama kali menampilkan notes
  setupEventListeners();  // Mengatur event listeners
};

// Jalankan inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', init);

