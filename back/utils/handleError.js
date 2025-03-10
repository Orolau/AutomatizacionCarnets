const handleHttpError = (res, message, code = 403) => {
    res.status(code).send(message)
    console.log("ERROR")
}

module.exports = { handleHttpError }