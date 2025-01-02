const UserValidation = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        })
        next()
    } catch (err) {
        res.status(404).json({
            message: err
        })
    }
}
const AdminValidation = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        })
        next()
    } catch (err) {
        res.status(404).json({
            message: err
        })
    }
}

module.exports = {
    UserValidation,
    AdminValidation
}