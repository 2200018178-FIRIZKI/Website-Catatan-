// Import mock data for fallback
// Note: Since we're not using modules, we'll access notesData globally

// Simpan catatan ke localStorage
function saveNotesToLocalStorage(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Get notes from global notesData or localStorage
function loadNotesFromLocalStorage() {
  const notes = localStorage.getItem('notes');
  if (notes) {
    return JSON.parse(notes);
  }
  // Fallback to global notesData if available
  return window.notesData || [];
}

// Tampilkan catatan pada halaman
function displayNotes(notes) {
  const notesGrid = document.getElementById('notes-grid');
  notesGrid.innerHTML = ''; // Clear the grid before displaying new notes

  notes.forEach(note => {
    const noteItem = document.createElement('note-item');
    noteItem.setAttribute('note-id', note.id);
    noteItem.setAttribute('title', note.title);
    noteItem.setAttribute('body', note.body);
    noteItem.setAttribute('created-at', note.createdAt);
    notesGrid.appendChild(noteItem);
  });
}

// Initialize notes from localStorage
let notes = [];

// Load notes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  notes = loadNotesFromLocalStorage();
  displayNotes(notes);
});

// Menambahkan event listener untuk form InputCatatan
document.addEventListener('DOMContentLoaded', () => {
  const inputCatatan = document.querySelector('input-catatan');

  if (inputCatatan) {
    inputCatatan.addEventListener('save-note', (event) => {
      const newNote = event.detail;
      notes.push(newNote);
      saveNotesToLocalStorage(notes);
      displayNotes(notes);
    });
  } else {
    console.error("Komponen 'input-catatan' belum diimplementasikan di DOM.");
  }
});

// Komponen Web untuk InputCatatan
class InputCatatan extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 20px;
          padding: 20px;
          background-color: #3700b3;
          border: 1px solid #ddd;
        }
        input, textarea {
          width: 95%;
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 5px;
        }
        button {
          background-color: #6200ea;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
        }
      </style>
      <div>
        <input type="text" id="note-title" placeholder="Title" />
        <textarea id="note-body" rows="5" placeholder="Write your note..."></textarea>
        <button id="save-note">Save Note</button>
      </div>
    `;

    this.shadowRoot.getElementById('save-note').addEventListener('click', () => {
      const title = this.shadowRoot.getElementById('note-title').value;
      const body = this.shadowRoot.getElementById('note-body').value;
      if (title && body) {
        const newNote = {
          id: `notes-${Date.now()}`,
          title,
          body,
          createdAt: new Date().toISOString(),
          archived: false
        };

        // Emit event untuk menambahkan catatan
        const event = new CustomEvent('save-note', {
          detail: newNote,
          bubbles: true
        });
        this.dispatchEvent(event);

        // Clear form fields after saving
        this.shadowRoot.getElementById('note-title').value = '';
        this.shadowRoot.getElementById('note-body').value = '';
      }
    });
  }
}

customElements.define('input-catatan', InputCatatan);

// Komponen Web untuk NoteItem
class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Menggunakan shadow DOM
  }

  // Fungsi yang dijalankan saat elemen terpasang ke DOM
  connectedCallback() {
    this.render();
  }

  // Fungsi untuk merender note
  render() {
    // Ambil atribut dari elemen
    const noteId = this.getAttribute('note-id');
    const title = this.getAttribute('title');
    const body = this.getAttribute('body');
    const createdAt = this.getAttribute('created-at');

    // Format tanggal
    const formattedDate = createdAt
      ? new Date(createdAt).toLocaleString()
      : 'No Date Provided';

    // Template HTML untuk Note Item
    this.shadowRoot.innerHTML = `
      <style>
        .note-item {
          border: 1px solid #ddd;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 8px;
          background-color: #fefefe;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .note-item h4 {
          margin: 0;
          font-size: 1.5em;
          color: #333;
        }
        .note-item p {
          margin: 8px 0;
          line-height: 1.6;
        }
        .note-item .date {
          font-size: 0.9em;
          color: #666;
        }
        .note-item .actions {
          margin-top: 15px;
        }
        .note-item .actions button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
          margin-right: 5px;
        }
        .note-item .actions button:hover {
          background-color: #0056b3;
        }
        .note-item .actions .archive-btn {
          background-color: #28a745;
        }
        .note-item .actions .archive-btn:hover {
          background-color: #218838;
        }
      </style>

      <div class="note-item">
        <h4>${title || 'Untitled Note'}</h4>
        <p>${body || 'No content available.'}</p>
        <p class="date">Created on: ${formattedDate}</p>
        <div class="actions">
          <button class="delete-btn">Delete</button>
          <button class="archive-btn">Archive</button>
        </div>
      </div>
    `;

    // Event listeners untuk tombol delete dan archive
    this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () =>
      this.handleDelete(noteId)
    );
    this.shadowRoot.querySelector('.archive-btn').addEventListener('click', () =>
      this.handleArchive(noteId)
    );
  }

  // Fungsi untuk menghapus note
  handleDelete(noteId) {
    if (!noteId) return;
    const deleteEvent = new CustomEvent('delete-note', {
      detail: { noteId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(deleteEvent);
  }

  // Fungsi untuk mengarsipkan note
  handleArchive(noteId) {
    if (!noteId) return;
    const archiveEvent = new CustomEvent('archive-note', {
      detail: { noteId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(archiveEvent);
  }
}

// Mendefinisikan custom element NoteItem
customElements.define('note-item', NoteItem);

// Fungsi untuk menampilkan daftar note di dalam container
export const showNotes = (notes, container) => {
  if (!Array.isArray(notes)) throw new Error('Notes must be an array');
  if (!container) throw new Error('Container is required');

  container.innerHTML = ''; // Bersihkan kontainer sebelum menambahkan note baru

  notes.forEach((note) => {
    const noteElement = document.createElement('note-item');
    noteElement.setAttribute('note-id', note.id);
    noteElement.setAttribute('title', note.title);
    noteElement.setAttribute('body', note.body);
    noteElement.setAttribute('created-at', note.createdAt);

    // Event listener untuk delete dan archive
    noteElement.addEventListener('delete-note', (e) => {
      const { noteId } = e.detail;
      handleDeleteNote(noteId); // Pastikan fungsi ini diimplementasikan di luar
    });

    noteElement.addEventListener('archive-note', (e) => {
      const { noteId } = e.detail;
      handleArchiveNote(noteId); // Pastikan fungsi ini diimplementasikan di luar
    });

    container.appendChild(noteElement);
  });
};

// Contoh fungsi handler (implementasi opsional di luar file ini)
const handleDeleteNote = (noteId) => {
  console.log(`Note ${noteId} will be deleted.`);
  // Tambahkan logika untuk menghapus note di sini
};

const handleArchiveNote = (noteId) => {
  console.log(`Note ${noteId} will be archived.`);
  // Tambahkan logika untuk mengarsipkan note di sini
};

// LoadingIndicator Custom Element (move definition before usage)
class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .spinner {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
      <div class="spinner"></div>
    `;
  }
}

// AppBar Custom Element
class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          background-color: #6200ea;
          color: white;
          z-index: 1000;
        }
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
        }
        h1 {
          margin: 0;
          font-size: 1.5em;
        }
        .nav-links {
          display: flex;
          gap: 20px;
        }
        .nav-links a {
          text-decoration: none;
          color: white;
          font-size: 1.2em;
        }
        .nav-links a:hover {
          text-decoration: underline;
        }
      </style>
      <nav>
        <h1>My Notes</h1>
        <div class="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#notes">Notes</a>
        </div>
      </nav>
    `;
  }
}

// Mendefinisikan custom element AppBar
customElements.define('app-bar', AppBar);

// Mendefinisikan custom element LoadingIndicator
customElements.define('loading-indicator', LoadingIndicator);
