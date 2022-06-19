module.exports = function(app) {
    
    const usuariosController = app.controllers.usuarios   

    app.get("/usuarios", usuariosController.listar)
    app.get("/usuarios/:id", usuariosController.consultarPorId)
    app.post("/usuarios", usuariosController.adicionar)
    app.put("/usuarios/:id", usuariosController.atualizar)
    app.delete("/usuarios/:id", usuariosController.excluir)
    app.post("/usuarios/login", usuariosController.login)
}