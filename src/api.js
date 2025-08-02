const API_URL = 'https://notes-api.dicoding.dev/v2'; // Ganti dengan URL API yang sebenarnya

// Menampilkan feedback ke pengguna dengan pesan kustom
const showUserFeedback = (message, isError = false) => {
  const feedbackElement = document.createElement('div');
  feedbackElement.textContent = message;
  feedbackElement.style.padding = '15px';
  feedbackElement.style.margin = '15px 0';
  feedbackElement.style.borderRadius = '5px';
  feedbackElement.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
  feedbackElement.style.color = isError ? '#721c24' : '#155724';
  feedbackElement.style.border = isError ? '1px solid #f5c6cb' : '1px solid #c3e6cb';
  feedbackElement.style.fontSize = '16px';
  feedbackElement.style.fontWeight = 'bold';
  feedbackElement.style.textAlign = 'center';

  document.body.insertBefore(feedbackElement, document.body.firstChild);

  setTimeout(() => {
    feedbackElement.remove();
  }, 5000);
};

// Fungsi untuk menangani respons dari API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    console.error('API Error:', errorData);
    showUserFeedback(errorData.message || 'Request failed', true);
    throw new Error(errorData.message || 'Request failed');
  }
  return await response.json();
};

// Fungsi umum untuk melakukan request dengan fetch
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error during fetch request:', error);
    showUserFeedback('An error occurred. Please try again later.', true);
    throw error;
  }
};

// Fungsi untuk mendapatkan semua notes
const getNotes = async () => {
  try {
    const response = await apiRequest(`${API_URL}/notes`);
    return response;
  } catch (error) {
    console.error('Error fetching notes:', error);
    // Fallback ke data lokal jika ada
    if (typeof window !== 'undefined' && window.notesData) {
      return { data: window.notesData };
    }
    throw error;
  }
};

// Fungsi untuk menambahkan note baru
const addNote = async (note) => {
  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    };
    const newNote = await apiRequest(`${API_URL}/notes`, options);
    showUserFeedback('Note added successfully!');
    return newNote;
  } catch (error) {
    console.error('Error adding note:', error);
    showUserFeedback('Failed to add note', true);
    throw error;
  }
};

// Fungsi untuk mengarsipkan note (mengubah status menjadi archived)
const archiveNote = async (noteId) => {
  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
    const updatedNote = await apiRequest(`${API_URL}/notes/${noteId}/archive`, options);
    showUserFeedback('Note archived successfully!');
    return updatedNote;
  } catch (error) {
    console.error('Error archiving note:', error);
    showUserFeedback('Failed to archive note', true);
    throw error;
  }
};

// Fungsi untuk menghapus note
const deleteNote = async (noteId) => {
  try {
    const options = { method: 'DELETE' };
    await apiRequest(`${API_URL}/notes/${noteId}`, options);
    showUserFeedback('Note deleted successfully!');
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    showUserFeedback('Failed to delete note', true);
    throw error;
  }
};

// Fungsi untuk menyegarkan tampilan catatan
const refreshNotes = async () => {
  const notes = await getNotes();
  displayNotes(notes);
};

// Fungsi untuk menampilkan notes secara dinamis
const displayNotes = (notes) => {
  const notesContainer = document.getElementById('notes-grid');
  if (!notesContainer) {
    console.warn('Notes container not found');
    return;
  }
  
  notesContainer.innerHTML = ''; // Clear previous notes

  if (!Array.isArray(notes) || notes.length === 0) {
    const noNotesMessage = document.createElement('div');
    noNotesMessage.textContent = 'No notes available';
    noNotesMessage.style.textAlign = 'center';
    noNotesMessage.style.padding = '20px';
    notesContainer.appendChild(noNotesMessage);
  } else {
    notes.forEach((note) => {
      const noteElement = document.createElement('div');
      noteElement.className = 'note-item';
      noteElement.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.body || note.content || 'No content'}</p>
        <small>Created at: ${new Date(note.createdAt).toLocaleString()}</small>
        <div class="note-actions">
          <button onclick="handleArchiveNote('${note.id}')">Archive</button>
          <button onclick="handleDeleteNote('${note.id}')">Delete</button>
        </div>
      `;
      notesContainer.appendChild(noteElement);
    });
  }
};

// Global functions for handling UI actions
window.handleArchiveNote = async (noteId) => {
  try {
    await archiveNote(noteId);
    await refreshNotes();
  } catch (error) {
    console.error('Error archiving note:', error);
  }
};

window.handleDeleteNote = async (noteId) => {
  try {
    await deleteNote(noteId);
    await refreshNotes();
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};

// Ambil catatan dan tampilkan saat halaman dimuat
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Add small delay to ensure DOM is fully loaded
    setTimeout(async () => {
      const notes = await getNotes();
      if (notes && notes.data) {
        displayNotes(notes.data); // API response has data property
      } else {
        displayNotes(notes || []); // Fallback for different response formats
      }
    }, 100);
  } catch (error) {
    console.error('Error loading notes:', error);
    // Show fallback message
    const notesContainer = document.getElementById('notes-grid');
    if (notesContainer) {
      notesContainer.innerHTML = '<p>Failed to load notes. Please try again later.</p>';
    }
  }
});

// Ekspor fungsi untuk digunakan di bagian lain dari aplikasi
export { getNotes, addNote, archiveNote, deleteNote, refreshNotes };










