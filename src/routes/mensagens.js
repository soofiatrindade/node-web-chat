module.exports = function(app) {
    
    const mensagensController = app.controllers.mensagens   

    app.get("/mensagens", mensagensController.listar)
}