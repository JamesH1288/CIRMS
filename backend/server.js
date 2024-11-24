require('dotenv').config(); 
const express = require('express');
const cors = require('cors'); 
const morgan = require('morgan'); 
const db = require('./db'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt'); // package for hashing passwords

const app = express();
const PORT = process.env.PORT || 4000; 

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
}));

// Middleware
app.use(express.json()); 
app.use(morgan('dev')); 

// to authenticate the JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

// a route  for user registration
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

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Database error:', err); 
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });
    } catch (error) {
        console.error('Server error:', error); 
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Route for login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // to check if a user exists
    const sql = `SELECT * FROM USERS WHERE USERNAME = ?`;
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];

        const match = await bcrypt.compare(password, user.PASSWORD_HASH); 
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const accessToken = jwt.sign(
            { id: user.USER_ID, username: user.USERNAME },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ accessToken });
    });
});

//  route to get all incidents
app.get('/api/incidents', authenticateToken, (req, res) => {
    db.query('SELECT * FROM INCIDENTS', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

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

// for getting an incident by searching for its ID
app.get('/api/incidents/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT 
            i.INCIDENT_ID, i.INCIDENT_TYPE, i.INCIDENT_DATE, 
            i.INCIDENT_DESCRIPTION, i.SEVERITY, i.IMPACT, 
            i.ACTIONS_TAKEN, s.STATUS_NAME, u.USERNAME AS ContactName
        FROM INCIDENTS i
        LEFT JOIN INCIDENT_STATUS s ON i.STATUS_ID = s.STATUS_ID
        LEFT JOIN USERS u ON i.USER_ID = u.USER_ID
        WHERE i.INCIDENT_ID = ?;
    `;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Incident not found' });
        res.json(results[0]);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
