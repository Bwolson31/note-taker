const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const app = express();
const PORT = 5624;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'Develop', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8'));
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuid.v4();

    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8'));
    notes.push(newNote);

    fs.writeFileSync(path.join(__dirname, 'Develop', 'db', 'db.json'), JSON.stringify(notes));

    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    let notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8'));
    notes = notes.filter((note) => note.id !== noteId);

    fs.writeFileSync(path.join(__dirname, 'Develop', 'db', 'db.json'), JSON.stringify(notes));

    res.json({ msg: 'Note deleted' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
