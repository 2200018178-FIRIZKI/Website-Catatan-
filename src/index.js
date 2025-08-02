// Importing required modules and styles
import './styles/main.css'; // Import CSS (Webpack will bundle this)
import './components/NoteItem'; // Custom element/component
import { fetchNotes, renderNotes } from './components/notes';
import { getNotes, addNote, deleteNote, archiveNote } from './api';
import { showNotes } from './components/NoteItem';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const noteListContainer = document.getElementById('note-list-container');
  const addNoteBtn = document.getElementById('add-note-btn');
  const addNoteModal = document.getElementById('add-note-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const noteForm = document.getElementById('note-form');

  // Display notes on the main page
  const displayNotes = async () => {
    try {
      const notes = await getNotes(); // Menggunakan getNotes
      const notesData = notes?.data || notes || []; // Handle different response formats
      if (noteListContainer && typeof showNotes === 'function') {
        showNotes(notesData, noteListContainer); // Render notes
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      if (noteListContainer) {
        noteListContainer.innerHTML = '<p>Failed to load notes. Please try again later.</p>';
      }
    }
  };

  // Open the modal to add a new note
  const openAddNoteModal = () => {
    if (addNoteModal) {
      addNoteModal.style.display = 'block';
    }
  };

  // Close the modal
  const closeAddNoteModal = () => {
    if (addNoteModal) {
      addNoteModal.style.display = 'none';
    }
  };

  // Add a new note from the form in the modal
  const handleAddNote = async (e) => {
    e.preventDefault();

    const titleInput = document.getElementById('note-title');
    const bodyInput = document.getElementById('note-body');
    
    if (!titleInput || !bodyInput) {
      console.error('Form inputs not found');
      return;
    }

    const title = titleInput.value;
    const body = bodyInput.value;

    // Validate input fields
    if (!title || !body) {
      alert('Title and body are required');
      return;
    }

    try {
      // Send data to the API to add a new note
      await addNote({ title, body });

      // Clear form
      titleInput.value = '';
      bodyInput.value = '';

      // Close the modal and refresh the notes list
      closeAddNoteModal();
      displayNotes();
    } catch (error) {
      console.error("Error adding note:", error);
      alert('Failed to add note');
    }
  };

  // Delete a note
  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      displayNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      alert('Failed to delete note');
    }
  };

  // Archive a note
  const handleArchiveNote = async (noteId) => {
    try {
      await archiveNote(noteId);
      displayNotes();
    } catch (error) {
      console.error("Error archiving note:", error);
      alert('Failed to archive note');
    }
  };

  // Event Listeners - with null checks
  if (addNoteBtn) {
    addNoteBtn.addEventListener('click', openAddNoteModal);
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeAddNoteModal);
  }
  
  if (noteForm) {
    noteForm.addEventListener('submit', handleAddNote);
  }

  // Initialize the app with notes
  displayNotes();

  // Make functions globally available for onclick handlers
  window.handleDeleteNote = handleDeleteNote;
  window.handleArchiveNote = handleArchiveNote;
});
