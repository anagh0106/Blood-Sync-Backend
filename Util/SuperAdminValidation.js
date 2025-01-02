const zod = require('zod');

const SuperAdminValidation = zod.object({
    body: zod.object({
        fname: zod.string().min(2).max(20),
        lname: zod.string().min(2).max(20),
        email: zod.string().email(),
        password: zod.string().min(8).max(20),
        role: zod.string().min(2).max(30)
    })
})
module.exports = SuperAdminValidation 
