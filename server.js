const express = require('express')
const path = require ('path');
const app = express();
const PORT = process.env.port || 3001;
const fs = require('fs');
const uuid = require('./helpers/uuid')
// const database = require('./db/db.json')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
  console.info(`${req.method} request received to get notes`)
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) =>{
        if (err) {
            console.log(err)
        }
        res.json(JSON.parse(data));
    })
})

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add note`);
    
    const {text, title} = req.body;

    if(text && title) {
        const newNote={
            text,
            title,
            id: uuid()
        };
        var dbArray;

        fs.readFile('./db/db.json', 'utf-8', (err, data) =>{
            if (err) {
                console.log(err)
            }
            dbArray = JSON.parse(data);
        
            dbArray.push(newNote);
        
            const dataString = JSON.stringify(dbArray, null, 3);
        
            fs.writeFile('./db/db.json', dataString, (err) =>
            err
            ? console.error(err)
            : console.log(`New note "${newNote.title}' has been added to the db.json file.`))
        
            const response = {
                status: 'success',
                body: newNote,
            };
        
            res.status(201).json(response);
        });
    } else {
        res.status(500).json('Error adding new note.')
    }
});


app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, './public/index.html'))
    );











app.listen(PORT, ()=> {
    console.log(`Notes app listening at http://localhost:${PORT}`);
});