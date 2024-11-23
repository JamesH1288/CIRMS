require('dotenv').config(); // Load environment variables
const express = require('express');
const db = require('./db'); // Database connection
const jwt = require('jsonwebtoken'); // For token-based authentication
const bcrypt = require('bcrypt'); // For password hashing
const morgan = require('morgan'); // Logger for better request monitoring

const app = express();
const PORT = process.env.PORT || 3000; // Ensure this matches your `.env` file

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for logging HTTP requests
app.use(morgan('dev'));

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

// Route for server health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Server is healthy!' });
});

// Route for user registration
app.post('/api/register', async (req, res) => {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the user into the database
        const sql = `INSERT INTO USERS (USERNAME, PASSWORD_HASH, EMAIL, USER_ROLE) VALUES (?, ?, ?, ?)`;
        const values = [username, hashedPassword, email, role];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Database error:', err); // Log database errors
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });
    } catch (error) {
        console.error('Server error:', error); // Log server errors
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Route for login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const sql = `SELECT * FROM USERS WHERE USERNAME = ?`;
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];

        // Compare password with hashed password
        const match = await bcrypt.compare(password, user.PASSWORD_HASH); // Use PASSWORD_HASH column
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate JWT
        const accessToken = jwt.sign(
            { id: user.USER_ID, username: user.USERNAME },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ accessToken });
    });
});

// Example protected route to get all incidents
app.get('/api/incidents', authenticateToken, (req, res) => {
    db.query('SELECT * FROM INCIDENTS', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Example protected route to create an incident
app.post('/api/incidents', authenticateToken, (req, res) => {
    const { userId, statusId, incidentType, description, date, severity } = req.body;
    const sql = `INSERT INTO INCIDENTS (USER_ID, STATUS_ID, INCIDENT_TYPE, INCIDENT_DESCRIPTION, INCIDENT_DATE, SEVERITY) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [userId, statusId, incidentType, description, date, severity];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, message: 'Incident created successfully' });
    });
});

// Fallback route for undefined endpoints
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
