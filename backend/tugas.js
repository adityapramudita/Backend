const sql = require('mysql')
const express = require('express');
const bodyParser = require('body-parser');
const { rows } = require('mssql');
const cors = require('cors')
const app = express()
const middleware = require('./middleware/authmiddle.js');
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
const myconnection = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tugas1'
})
myconnection.connect(function (err){
    if(err) console.log(err);
    else console.log("Database Connected!")
})
app.get('/', (req, res) => {
    res.send(`
    <html>
        <div>
            <form method="post" action="/todo">
            <input type="text" name="isi"/>
            <button type="submit">Add</button>
            </form>
        </div>
    </html>
    `)
})
app.post('/todo', (req, res) => {
    var isidata = req.body.deskripsi
    var qry = "INSERT INTO custumer (deskripsi) VALUES ('"+isidata+"')"
    myconnection.query(qry, isidata, function(err, result){
        if(err) throw err;
        console.log("User Data has inserted!")
    })
    res.end()
})
app.get('/todo', middleware, (req, res) => {
    myconnection.query("SELECT * from custumer", (err, rows, field) => {
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err)
        }
    })
})
app.delete('/todo/:id', (req, res) => {
    myconnection.query("delete from custumer where id='"+req.params.id+"'")
    res.end()
})

app.get('/user', middleware,(req,res,next) => {
    myconnection.query("SELECT id, username FROM user", function(err, rows, result) {
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err)
        }
    })
})
app.post('/user', (req, res, next) => {
    myconnection.query('SELECT COUNT(*) as jlhusr FROM user', function(err, result) {
        const data = Object.values(result)
        if(data[0].jlhusr > 0) {
            middleware(req,res,next)
        } else {
            next()
        }
    })
},(req, res) => {
    const user = req.body.username
    const pass = req.body.password
    myconnection.query("INSERT INTO user (username, password) VALUES (?,?)",[user, pass], function(err){
        if(err){
            res.end(500)
            return
        }
    })
})
app.delete('/user/:id', middleware, (req,res) => {
    myconnection.query('SELECT COUNT(*) as jlhuser FROM user', function(err, result) {
        var convert = Object.values(result)
        if(convert[0].jlhusr > 1) {
            myconnection.query("DELETE from user WHERE id='"+req.params.id+"'")
            res.end("Data di hapus")
        } else {
            res.end(401)
        }
    })
})


app.listen(3030);
