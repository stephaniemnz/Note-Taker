const express = require('express');
const fs = require('fs'); 
const path = require('path');  
const app = express();
const PORT = process.env.PORT || 3000;

const notes = require('./db/db.json');  

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

/// GET Route for homepage
app.get('/', (req, res) =>
res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for Notes page
app.get('/notes', (req, res) =>
res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET request for existing notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error reading notes data." });
        }
        res.json(JSON.parse(data));
    });
});

// POST request to add a new note
const { v4: uuidv4 } = require('uuid'); 

app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: uuidv4() }; // Assigns a unique ID to the new note

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error reading notes data." });
        }
        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error saving new note." });
            }
            res.json(newNote);
        });
    });
});

// Start the server on the port
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});