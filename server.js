const express = require('express');
const path = require('path');  
const app = express();
const fs = require('fs');   
const PORT = process.env.PORT || 3000;
const api = require('./routes/api');
const notespad = require('./db/db.json');        

// Serve static files from the 'public' folder
app.use(express.static('public'));

// GET /notes - Return the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// GET * - Return the index.html file for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


// POST /api/notes - Add a new note to db.json
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const data = readDBFile();
    newNote.id = data.notes[data.notes.length - 1].id + 1; // Simple ID assignment
    data.notes.push(newNote);
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(data, null, 2), 'utf8');
    res.status(201).json(newNote);
  });





// GET /api/notes - Read the db.json file and return all saved notes as JSON
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});