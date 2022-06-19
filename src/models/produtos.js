module.exports = (app) => {
    var ProdutosSchema = app.get("mongoose").Schema({
        nome: String,
        valor: Number,
        imagem: String
    })
    app.get("mongoose").model('Produtos', ProdutosSchema);
}