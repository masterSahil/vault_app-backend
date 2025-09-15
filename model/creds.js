const {Schema, model} = require('mongoose')

const Creds = new Schema({
    site: String,
    username: String,
    userEmail: String,
    password: String,
    userId: String,
    createdAt: {type: String, default: Date.now()},
});

module.exports = model("Credentials", Creds);