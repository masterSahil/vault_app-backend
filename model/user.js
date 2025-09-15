const {model, Schema} = require('mongoose');

const userSchema = new Schema({
    fullname: {type: String},
    email: {type: String},
    password: {type: String},
    mpin: {type: Number, default: null},
});

module.exports = model("vaultUser", userSchema);