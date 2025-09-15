const {Schema, model} = require('mongoose')

const linkSchema = new Schema({
    title: String,
    url: String,
    userId: String,
    createdAt: {type: String, default: Date.now()},
});

module.exports = model("link", linkSchema);