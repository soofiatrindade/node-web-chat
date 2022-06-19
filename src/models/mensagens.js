module.exports = (app) => {
    const MensagensSchema = app.get("mongoose").Schema({
        texto: String,
        data: Date,
        usuario: { type: app.get("mongoose").Schema.Types.ObjectId, ref: 'Usuarios' }
    })
    
    app.get("mongoose").model("Mensagens", MensagensSchema)

}
