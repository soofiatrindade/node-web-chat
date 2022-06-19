module.exports = function(app){

    app.use("*", app.middlewares.auth.filter)

    app.get("/", function(req, res) {
        res.end("Seja muito bem-vindo!");
    })
}