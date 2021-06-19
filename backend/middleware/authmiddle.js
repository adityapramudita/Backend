const sql = require('mysql')
const myconnection = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tugas1'
})

module.exports = function(req, res, next) {
    const username = req.headers.username
    const password = req.headers.password
    myconnection.query('SELECT username from user WHERE username=? AND password=?', [username, password], function(err, result) {
        if(result.length > 0) {
            next()
        } else {
            res.send(401)
        }
    })
}