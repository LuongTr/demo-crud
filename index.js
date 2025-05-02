const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// SQL Server Configuration
const config = {
    user: 'sa',
    password: '260203',
    server: 'DESKTOP-UNPULAB',
    database: 'BookDB',
    options: {
        trustServerCertificate: true,
        encrypt: false,
        enableArithAbort: true
    }
};

sql.connect(config).then(pool => {
    return pool.request().query('SELECT 1 AS test');
}).then(result => {
    console.log('✅ Kết nối thành công:', result.recordset);
}).catch(err => {
    console.error('❌ Kết nối thất bại:', err);
});

// Database Connection Pool
let pool;
async function connectToDatabase() {
    try {
        if (!pool) {
            console.log('Creating new connection pool...');
            pool = await sql.connect(config);
            console.log('Database connected successfully');
        }
        return pool;
    } catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
}

// Test connection on startup
connectToDatabase().catch(err => {
    console.error('Failed to connect to database on startup:', err);
});

// API Routes

// Get all books
app.get('/api/books', async (req, res) => {
    try {
        await connectToDatabase();
        const result = await pool.request().query('SELECT * FROM Books ORDER BY Id DESC');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ error: 'Failed to fetch books', details: err.message });
    }
});

// Get book by ID
app.get('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await connectToDatabase();
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Books WHERE Id = @id');
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        res.json(result.recordset[0]);
    } catch (err) {
        console.error(`Error fetching book with ID ${req.params.id}:`, err);
        res.status(500).json({ error: 'Failed to fetch book', details: err.message });
    }
});

// Add new book
app.post('/api/books', async (req, res) => {
    try {
        const { Title, Author, Year } = req.body;
        
        // Validate required fields
        if (!Title || !Author || !Year) {
            return res.status(400).json({ error: 'Title, Author and Year are required' });
        }
        
        await connectToDatabase();
        
        const result = await pool.request()
            .input('title', sql.NVarChar, Title)
            .input('author', sql.NVarChar, Author)
            .input('year', sql.Int, Year)
            .query('INSERT INTO Books (Title, Author, Year) OUTPUT INSERTED.* VALUES (@title, @author, @year)');
            
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        console.error('Error adding new book:', err);
        res.status(500).json({ error: 'Failed to add book', details: err.message });
    }
});

// Update book
app.put('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Title, Author, Year } = req.body;
        
        // Validate required fields
        if (!Title || !Author || !Year) {
            return res.status(400).json({ error: 'Title, Author and Year are required' });
        }
        
        await connectToDatabase();
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('title', sql.NVarChar, Title)
            .input('author', sql.NVarChar, Author)
            .input('year', sql.Int, Year)
            .query(`
                UPDATE Books 
                SET Title = @title, Author = @author, Year = @year 
                OUTPUT INSERTED.* 
                WHERE Id = @id
            `);
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        res.json(result.recordset[0]);
    } catch (err) {
        console.error(`Error updating book with ID ${req.params.id}:`, err);
        res.status(500).json({ error: 'Failed to update book', details: err.message });
    }
});

// Delete book
app.delete('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await connectToDatabase();
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Books OUTPUT DELETED.* WHERE Id = @id');
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        res.json({ message: 'Book deleted successfully', deletedBook: result.recordset[0] });
    } catch (err) {
        console.error(`Error deleting book with ID ${req.params.id}:`, err);
        res.status(500).json({ error: 'Failed to delete book', details: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});