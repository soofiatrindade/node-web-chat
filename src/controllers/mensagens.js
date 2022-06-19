module.exports = function(app) {

    mensagensModel = app.get("mongoose").model("Mensagens")

    return {
        listar: function(req, res) {
            mensagensModel.find({}).populate("usuario").sort({ _id: -1 }).limit(5).then((mensagens) => {
                mensagens = mensagens.reverse()
                res.json(mensagens);
            }).catch((err) => {
                res.sendStatus(500);
            })
        }
    }
}