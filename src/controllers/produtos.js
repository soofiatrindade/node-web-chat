module.exports = function(app) {

    produtosModel = app.get("mongoose").model("Produtos")

    return {
        listar: function(req, res) {
            produtosModel.find({}).then((produtos) => {
                res.json(produtos);
            }).catch((err) => {
                res.sendStatus(500);
            })
        },
        consultarPorId: function(req, res) {
            let id = req.params.id
            produtosModel.findById(id).then((produto, err) => {
                if(err)
                    res.end("Não foi possível consultar o produto");
                else
                    res.json(produto)
            })
        },
        adicionar: (req, res) => {
            let produto = new produtosModel(req.body)
            produto.imagem = req.file.path
            produto.save((err) => {
                res.send(err ? err : "Produto adicionado com sucesso")
            })
        },
        atualizar: (req, res) => {
            let id = req.params.id
            let produto = req.body
            produtosModel.findByIdAndUpdate(id, produto, (err) => {
                res.send(err ? err : "Produto atualizado com sucesso")
            })
        },
        excluir: (req, res) => {
            let id = req.params.id
            produtosModel.findByIdAndRemove(id, (err) => {
                res.send(err ? err : "Produto excluído com sucesso")
            })
        }
    }
}