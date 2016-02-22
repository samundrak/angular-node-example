module.exports = {
    show(req, res, next) {
        res.render(req.params.template)
    }
}
