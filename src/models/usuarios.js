module.exports = (app) => {
    const UsuariosSchema = app.get("mongoose").Schema({
        nome: String,
        email: { type: String, lowercase: true, required: [true, "é obrigatório"], match: [/\S+@\S+\.\S+/, 'é inválido'] },
        senha: { type: String, lowercase: true, required: [true, "é obrigatório"] }
    })
    
    app.get("mongoose").model("Usuarios", UsuariosSchema)

}
