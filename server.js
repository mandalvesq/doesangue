var winston = require('winston');


var logger = new (winston.createLogger)({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './all-logs.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: './exceptions.log' })
  ]
});
const express = require("express")
const server = express()
const nunjucks = require("nunjucks")
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '',
    host: 'doesangue..us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'doesangue'
})

server.use(express.static('public'))
server.use(express.urlencoded({extended: true}))


nunjucks.configure("./", {
    express: server,
    noCache: true
})

server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados parte 1");

        logger.warn('Banco de dados error'); 
        const donors = result.rows;
        return res.render("index.html", { donors })
    })

    donors = []
    
})

server.post("/", function(req, res){
    // pegar dados do formulário // 
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
	logger.warn('Todos os campos sao obrigatorios');    
        res.send("Todos os campos são obrigatórios.")
    }

    const query = `INSERT INTO "donors" ("name","email", "blood") 
                    VALUES ($1, $2, $3)`

    const values = [name, email, blood]
    db.query(query, values, function(err, ){

        if (err) return res.send("Erro no Banco de dados")

        return res.redirect("/")

    })

})
server.listen(80,'0.0.0.0', function() {
    console.log("Iniciei o servidor")
})
