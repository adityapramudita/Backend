const sql = require('mysql')
const express = require('express');
const bodyParser = require('body-parser');
const { rows } = require('mssql');
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
const con = sql.createConnection({
    host: 'localhost',
    user: 'rootnodenode',
    password: '',
    database: 'tugas1'
})
con.connect(function (err){
    if(err) console.log(err);
    else console.log("Connected!")
})
app.get('/', (req, res) => {
    res.send(`<html>
    <div><form method="post" action="/tugas1"><input type="text" name="kode"/><button type="submit">Add</button></div></form></html>`)
})
app.post('/tugas1', (req, res) => {
    var data = req.body.kode
    var sqll = "INSERT INTO custumer (desk) VALUES ('"+data+"')"
    con.query(sqll, data, function(err, data1){
        if(err) throw err;
        console.log("User Data has inserted!")
    })
    res.end()
})
app.get('/tugas1', (req, res) => {
    con.query("SELECT * from custumer", (err, rows, field) => {
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err)
        }
    })
})

app.listen(3000);


