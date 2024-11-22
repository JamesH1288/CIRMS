require('dotenv').config(); // Load .env variables
const express = require('express');
const db = require('./db'); // Updated DB module uses mysql2
const jwt = require('jsonwebtoken'); // For token-based authentication
const bcrypt = require('bcrypt'); // For password hashing
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

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

// Route for login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    const sql = `SELECT * FROM USERS WHERE USERNAME = ?`;
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];

        // Compare password with hashed password
        const match = await bcrypt.compare(password, user.PASSWORD); // Assuming PASSWORD column exists
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

// Route to get all incidents (protected)
app.get('/api/incidents', authenticateToken, (req, res) => {
    db.query('SELECT * FROM INCIDENTS', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Route to get a specific incident by ID (protected)
app.get('/api/incidents/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT
            i.INCIDENT_ID,
            i.INCIDENT_TYPE,
            i.OTHER_DESCRIPTION,
            i.INCIDENT_DATE,
            i.INCIDENT_DESCRIPTION,
            i.AFFECTED_SYSTEMS,
            i.IMPACT,
            i.ACTIONS_TAKEN,
            i.CREATED_AT,
            i.UPDATED_AT,
            s.STATUS_NAME,
            u.USERNAME AS ContactName
        FROM INCIDENTS i
        LEFT JOIN INCIDENT_STATUS s ON i.STATUS_ID = s.STATUS_ID
        LEFT JOIN USERS u ON i.USER_ID = u.USER_ID
        WHERE i.INCIDENT_ID = ?;
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Db error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Incident not found' });
        }
        res.json(result[0]);
    });
});

// Route to create a new incident (protected)
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

// Route to update an incident by ID (protected)
app.put('/api/incidents/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { statusId, description, severity } = req.body;
    const sql = `UPDATE INCIDENTS SET STATUS_ID = ?, INCIDENT_DESCRIPTION = ?, SEVERITY = ? WHERE INCIDENT_ID = ?`;
    const values = [statusId, description, severity, id];

    db.query(sql, values, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Incident updated successfully' });
    });
});

// Route to delete an incident by ID (protected)
app.delete('/api/incidents/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM INCIDENTS WHERE INCIDENT_ID = ?', [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Incident deleted successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
