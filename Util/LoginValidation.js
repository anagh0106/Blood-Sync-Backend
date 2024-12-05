const zod = require("zod")

const loginValidation = zod.object({
    body: zod.object({
        email: zod.string().email(),
        password: zod.string().min(8).max(20).regex(/^(?=.*[]) (?=.* [a - z])(?=.* [A - Z])(?=.* [0 - 9])(?=.*) /),
    })
})

module.exports = {
    loginValidation,
}