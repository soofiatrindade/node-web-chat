const port = 3000
const host = "localhost"
const express = require("express")
const consign = require("consign")
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const app = express()
const server = require("http").Server(app)
const io = require('socket.io')(server);
const cors = require('cors')
require('dotenv').config();


app.set("jwt", jwt);
app.set("mongoose", mongoose)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/uploads', express.static('uploads')); // Liberar acesso a pasta uploads

mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTH_DB}`, { 
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false 
})
.then(() => console.log("conexão realizada com o MongoDB"))
.catch((err) => console.log("Erro ao realizar conexão com MongoDB: " + err))

consign({ cwd: 'src' })
    .include("models")
    .then("middlewares")
    .then("utils")
    .then("controllers")
    .then("routes")
    .into(app)

let UsuariosModel = app.get("mongoose").model("Usuarios");
let MensagensModel = app.get("mongoose").model("Mensagens");


io.on('connection', (client) => {
    let token = client.handshake.query.token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        UsuariosModel.findOne({ email: decoded.email }).then((res) => {
            let usuario_conectado = {
                date: new Date(),
                texto: "O usuário <strong>" + res.nome + "</strong> se conectou.",
                usuario: null
            }
            client.broadcast.emit("mensagem", usuario_conectado)
            client.on('mensagem', (msg) => {
                msg = JSON.parse(msg)
                
                let mensagem = new MensagensModel({
                    texto: msg.texto,
                    usuario: res,
                    data: new Date()
                })
                mensagem.save((res) => {
                    client.emit("mensagem", mensagem);
                    client.broadcast.emit("mensagem", mensagem);
                })
            })
            client.on('disconnect', (msg) => {
                let usuario_saiu = {
                    date: new Date(),
                    texto: "<strong>" + res.nome + "</strong> saiu.",
                    usuario: null
                }
                client.broadcast.emit("mensagem", usuario_saiu)
            })
        })
    })
})


server.listen(port, function() {
    console.log(`Aplicação rodando no endereço ${host}:${port}`)
})
