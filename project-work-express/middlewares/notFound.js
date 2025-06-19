function notFound(err, res, _) {

    res.status(404)
    res.json({
        errorStatus: 404,
        erroMessage: err.message
    })
}

module.exports = notFound