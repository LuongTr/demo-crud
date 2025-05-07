const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const config = {
    user: 'sa',
    password: '260203',
    server: 'DESKTOP-UNPULAB',
    database: 'EmployeeDB',
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

// Get all employees
app.get('/api/employees', async (req, res) => {
    try {
        await connectToDatabase();
        const result = await pool.request().query('SELECT * FROM Employees ORDER BY Id DESC');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ error: 'Failed to fetch employees', details: err.message });
    }
});

// Get employee by ID
app.get('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await connectToDatabase();
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Employees WHERE Id = @id');
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        res.json(result.recordset[0]);
    } catch (err) {
        console.error(`Error fetching employee with ID ${req.params.id}:`, err);
        res.status(500).json({ error: 'Failed to fetch employee', details: err.message });
    }
});

// Add new employee
app.post('/api/employees', async (req, res) => {
    try {
        const { Name, Position, Salary } = req.body;
        
        if (!Name || !Position || !Salary) {
            return res.status(400).json({ error: 'Name, Position and Salary are required' });
        }
        
        await connectToDatabase();
        
        const result = await pool.request()
            .input('name', sql.NVarChar, Name)
            .input('position', sql.NVarChar, Position)
            .input('salary', sql.Decimal(10,2), Salary)
            .query('INSERT INTO Employees (Name, Position, Salary) OUTPUT INSERTED.* VALUES (@name, @position, @salary)');
            
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        console.error('Error adding new employee:', err);
        res.status(500).json({ error: 'Failed to add employee', details: err.message });
    }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Position, Salary } = req.body;
        
        if (!Name || !Position || !Salary) {
            return res.status(400).json({ error: 'Name, Position and Salary are required' });
        }
        
        await connectToDatabase();
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, Name)
            .input('position', sql.NVarChar, Position)
            .input('salary', sql.Decimal(10,2), Salary)
            .query(`
                UPDATE Employees 
                SET Name = @name, Position = @position, Salary = @salary 
                OUTPUT INSERTED.* 
                WHERE Id = @id
            `);
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        res.json(result.recordset[0]);
    } catch (err) {
        console.error(`Error updating employee with ID ${req.params.id}:`, err);
        res.status(500).json({ error: 'Failed to update employee', details: err.message });
    }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await connectToDatabase();
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Employees OUTPUT DELETED.* WHERE Id = @id');
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        res.json({ message: 'Employee deleted successfully', deletedEmployee: result.recordset[0] });
    } catch (err) {
        console.error(`Error deleting employee with ID ${req.params.id}:`, err);
        res.status(500).json({ error: 'Failed to delete employee', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});