require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Route for user registration
app.post('/api/register', async (req, res) => {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = `INSERT INTO USERS (USERNAME, PASSWORD_HASH, EMAIL, USER_ROLE) VALUES (?, ?, ?, ?)`;
        const values = [username, hashedPassword, email, role];

        db.query(sql, values, (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Route for user login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const sql = `SELECT * FROM USERS WHERE USERNAME = ?`;
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.PASSWORD_HASH);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { id: user.USER_ID, username: user.USERNAME },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ accessToken });
    });
});

// Route to get all incidents
app.get('/api/incidents', (req, res) => {
    const sql = `
        SELECT 
            i.INCIDENT_ID, i.INCIDENT_TYPE, i.INCIDENT_DATE, 
            i.INCIDENT_DESCRIPTION, i.SEVERITY, i.IMPACT, 
            i.ACTIONS_TAKEN, i.STATUS_ID, i.OTHER_DESCRIPTION,
            u.USERNAME AS ContactName
        FROM INCIDENTS i
        LEFT JOIN USERS u ON i.USER_ID = u.USER_ID
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Route to create a new incident
app.post('/api/incidents', (req, res) => {
    const {
        userId = 1,
        statusId = 1,
        incidentType,
        description,
        date,
        severity = 'Low',
        affectedSystems = null,
        impact = null,
        actionsTaken = null,
        otherDescription = null,
    } = req.body;

    // Validate required fields
    if (!incidentType || !description || !date) {
        return res.status(400).json({
            error: 'Required fields: incidentType, description, and date must not be null.',
        });
    }

    const sql = `
        INSERT INTO INCIDENTS 
        (USER_ID, STATUS_ID, INCIDENT_TYPE, INCIDENT_DESCRIPTION, INCIDENT_DATE, AFFECTED_SYSTEMS, SEVERITY, IMPACT, ACTIONS_TAKEN, OTHER_DESCRIPTION)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        userId,
        statusId,
        incidentType,
        description,
        date,
        affectedSystems,
        severity,
        impact,
        actionsTaken,
        otherDescription,
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to create incident.' });
        }
        res.status(201).json({ id: result.insertId, message: 'Incident created successfully.' });
    });
});

// Route to get an incident by ID
app.get('/api/incidents/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT 
            i.INCIDENT_ID, i.INCIDENT_TYPE, i.INCIDENT_DATE, 
            i.INCIDENT_DESCRIPTION, i.SEVERITY, i.IMPACT, 
            i.ACTIONS_TAKEN, i.STATUS_ID, i.OTHER_DESCRIPTION,
            u.USERNAME AS ContactName
        FROM INCIDENTS i
        LEFT JOIN USERS u ON i.USER_ID = u.USER_ID
        WHERE i.INCIDENT_ID = ?;
    `;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(404).json({ message: 'Incident not found' });
        res.json(results[0]);
    });
});

// Route to update an incident
app.put('/api/incidents/:id', (req, res) => {
    const { id } = req.params;
    const { STATUS_ID, INCIDENT_TYPE, INCIDENT_DESCRIPTION } = req.body;

    const sql = `
        UPDATE INCIDENTS
        SET STATUS_ID = ?, INCIDENT_TYPE = ?, INCIDENT_DESCRIPTION = ?
        WHERE INCIDENT_ID = ?
    `;
    const values = [STATUS_ID, INCIDENT_TYPE, INCIDENT_DESCRIPTION, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update incident.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Incident not found.' });
        }

        const selectSql = `SELECT * FROM INCIDENTS WHERE INCIDENT_ID = ?`;
        db.query(selectSql, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch updated incident.' });
            }
            res.json(results[0]);
        });
    });
});

// Route to delete an incident
app.delete('/api/incidents/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM INCIDENTS WHERE INCIDENT_ID = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete incident.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Incident not found.' });
        }
        res.json({ message: 'Incident deleted successfully.' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
