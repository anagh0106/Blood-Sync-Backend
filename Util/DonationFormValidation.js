const zod = require("zod")

const FormValidation = zod.object({
    body: zod.object({
        firstname: zod.string().min(2).max(50),
        lastname: zod.string().min(2).max(50),
        age: zod.number().min(18, { message: "You are not able to donate blood " })
            .max(65, { message: "Your Age Must Be Less Than 65" }),
        email: zod.string().email(),
        phone: zod.string()
            .regex(/^\d{10}$/, { message: "Mobile must be a valid 10-digit number" }),
        city: zod.string(),
    })
})

module.exports = FormValidation
