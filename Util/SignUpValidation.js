const zod = require('zod'); // is used for validation

const SignupValidation = zod.object({
    body: zod.object({
        firstname: zod.string().min(2).max(20),
        lastname: zod.string().min(2).max(20),
        email: zod.string().email(),
        password: zod.string().min(8).max(20),
    })
})

module.exports = SignupValidation