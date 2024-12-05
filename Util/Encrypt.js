const bcrypt = require("bcrypt")

const encryptPassowrd = (password) => {
    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(password, salt)
    return hash;
}

const decryptPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}
const comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

module.exports = {
    encryptPassowrd,
    decryptPassword,
    comparePassword
}