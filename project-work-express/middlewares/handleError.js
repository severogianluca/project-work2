function handleError(err, res, _) {

    res.status(500)
    res.json({
        errorStatus: 500,
        erroMessage: err.message
    })
}

module.exports = handleError