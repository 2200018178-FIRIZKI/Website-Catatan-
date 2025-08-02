// Importing required modules and styles
import './styles/main.css'; // Import CSS (Webpack will bundle this)
import './components/NoteItem'; // Custom element/component
import { fetchNotes, renderNotes, } from './components/notes';
import { getNotes, addNote, deleteNote, archiveNote } from './api';
import { showNotes } from './components/NoteItem';

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
    showNotes(notes, noteListContainer); // Render notes
  } catch (error) {
    console.error("Error fetching notes:", error);
    alert('Failed to load notes');
  }
};

// Open the modal to add a new note
const openAddNoteModal = () => {
  addNoteModal.style.display = 'block';
};

// Close the modal
const closeAddNoteModal = () => {
  addNoteModal.style.display = 'none';
};

// Add a new note from the form in the modal
const handleAddNote = async (e) => {
  e.preventDefault();

  const title = document.getElementById('note-title').value;
  const body = document.getElementById('note-body').value;

  // Validate input fields
  if (!title || !body) {
    alert('Title and body are required');
    return;
  }

  try {
    // Send data to the API to add a new note
    await addNote({ title, body });

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

// Event Listeners
addNoteBtn.addEventListener('click', openAddNoteModal);
closeModalBtn.addEventListener('click', closeAddNoteModal);
noteForm.addEventListener('submit', handleAddNote);

// Initialize the app with notes
displayNotes();

// Fetch notes and render them when the page loads
window.addEventListener('DOMContentLoaded', async () => {
  const notes = await fetchNotes();
  renderNotes(notes); // Render notes on page load
});
