const crypto = require('crypto')
module.exports = function(app) {

    const usuariosModel = app.get("mongoose").model("Usuarios")
    return {
        listar: function(req, res) {
            usuariosModel.find({}).then((usuarios) => {
                res.json(usuarios)
            })
            
        },
        consultarPorId: function(req, res) {
            let id = req.params.id
            usuariosModel.findById(id).then((usuario) => {
                res.json(usuario)
            })
        },
        adicionar: (req, res) => {
            let usuario = new usuariosModel(req.body)
            usuario.senha = crypto.createHash("md5").update(usuario.senha).digest('hex')
            usuario.save((err) => {
                if(err){
                    res.status(422).json(err)
                } else {
                    res.sendStatus(200)
                }
            })
        },
        atualizar: (req, res) => {
            let id = req.params.id
            let usuario = req.body
            usuariosModel.findByIdAndUpdate(id, usuario, (err) => {
                if(err){
                    res.status(422).json(err)
                } else {
                    res.status(200).end()
                }
            })
        },
        excluir: (req, res) => {
            let id = req.params.id
            usuariosModel.findByIdAndDelete(id, (err) => {
                if(err) {
                    res.status(422).json(err)
                } else {
                    res.sendStatus(200)
                }
            })
        },
        login: (req, res) => {
            let email = req.body.email
            let senha = req.body.senha
            senha = crypto.createHash("md5").update(senha).digest('hex')

            usuariosModel.findOne({ email: email }).then((usuario) => {
                if(! usuario) {
                    res.status(422).end("Email não cadastrado")
                } else if(usuario.senha != senha) {
                    res.status(422).end("Senha inválida")
                } else {
                    let jwt = app.get("jwt")
                    let token = jwt.sign({ email }, process.env.JWT_SECRET, {
                        expiresIn: 60*60*24 // expires in 24 hours
                    });
                    res.json({
                        token,
                        usuario
                    })
                }
            })
        }
    }
}