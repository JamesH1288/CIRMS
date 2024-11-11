const express = require('express');
const db = require('./db'); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.get('/api/incidents', (req, res) => {
    db.query('SELECT * FROM INCIDENTS', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/incidents/:id', (req, res) => {
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

    db.query(sql, [id], (err, result)=> {
        if (err) {
            return res.status(500).json({error: 'Db error'});
        }
        if (result.length === 0){
            return res.status(404).json({ error: 'Incident not found'});
        }
        res.json(result[0]);
    });
});


app.post('/api/incidents', (req, res) => {
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

app.put('/api/incidents/:id', (req, res) => {
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

app.delete('/api/incidents/:id', (req, res) => {
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
