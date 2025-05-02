// API Base URL
const API_URL = 'http://localhost:3000/api/books';

// DOM Elements
const bookForm = document.getElementById('book-form');
const formTitle = document.getElementById('form-title');
const bookIdInput = document.getElementById('book-id');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const yearInput = document.getElementById('year');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const booksList = document.getElementById('books-list');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const noBooks = document.getElementById('no-books');
const booksTable = document.getElementById('books-table');

// State management
let isEditing = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    bookForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
}

// Fetch all books from the API
async function fetchBooks() {
    try {
        showLoading(true);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const books = await response.json();
        
        showLoading(false);
        displayBooks(books);
    } catch (error) {
        showLoading(false);
        showError(`Failed to fetch books: ${error.message}`);
        console.error('Error fetching books:', error);
    }
}

// Display books in the table
function displayBooks(books) {
    if (books.length === 0) {
        booksTable.classList.add('hidden');
        noBooks.classList.remove('hidden');
        return;
    }
    
    booksTable.classList.remove('hidden');
    noBooks.classList.add('hidden');
    
    booksList.innerHTML = books.map(book => `
        <tr>
            <td>${book.Id}</td>
            <td>${escapeHtml(book.Title)}</td>
            <td>${escapeHtml(book.Author)}</td>
            <td>${book.Year}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${book.Id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${book.Id}">Delete</button>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to the action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editBook(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteBook(parseInt(btn.dataset.id)));
    });
}

// Handle form submission (Add/Update book)
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const bookData = {
        Title: titleInput.value,
        Author: authorInput.value,
        Year: parseInt(yearInput.value)
    };
    
    try {
        if (isEditing) {
            // Update existing book
            const bookId = parseInt(bookIdInput.value);
            await updateBook(bookId, bookData);
        } else {
            // Add new book
            await addBook(bookData);
        }
        
        resetForm();
        fetchBooks();
    } catch (error) {
        showError(`Failed to ${isEditing ? 'update' : 'add'} book: ${error.message}`);
        console.error(`Error ${isEditing ? 'updating' : 'adding'} book:`, error);
    }
}

// Add a new book
async function addBook(bookData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    return response.json();
}

// Update an existing book
async function updateBook(id, bookData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    return response.json();
}

// Delete a book
async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }
        
        fetchBooks();
    } catch (error) {
        showError(`Failed to delete book: ${error.message}`);
        console.error('Error deleting book:', error);
    }
}

// Edit a book (populate form for editing)
async function editBook(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const book = await response.json();
        
        // Populate form with book data
        bookIdInput.value = book.Id;
        titleInput.value = book.Title;
        authorInput.value = book.Author;
        yearInput.value = book.Year;
        
        // Change form state to editing mode
        formTitle.textContent = 'Edit Book';
        submitBtn.textContent = 'Update Book';
        cancelBtn.classList.remove('hidden');
        isEditing = true;
        
        // Scroll to form
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showError(`Failed to load book details: ${error.message}`);
        console.error('Error fetching book details:', error);
    }
}

// Reset form to its initial state
function resetForm() {
    bookForm.reset();
    bookIdInput.value = '';
    formTitle.textContent = 'Add New Book';
    submitBtn.textContent = 'Add Book';
    cancelBtn.classList.add('hidden');
    isEditing = false;
    errorMessage.classList.add('hidden');
}

// Utility functions
function showLoading(isLoading) {
    if (isLoading) {
        loadingElement.classList.remove('hidden');
        booksTable.classList.add('hidden');
        noBooks.classList.add('hidden');
    } else {
        loadingElement.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}