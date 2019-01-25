const express = require('express')
var streem = require('./streem');
const app = express()
const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))



app.get('/video', streem.getVideo );

app.get('/audio', streem.getAudio );

app.get('/:file', streem.getfile );

app.listen(port, () => console.log(`Example app listening on port ${port}!`))