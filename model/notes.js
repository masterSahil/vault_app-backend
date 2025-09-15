const {Schema, model} = require('mongoose')

const notes = new Schema({
    title: String, 
    note: String,
    userId: String,
    createdAt: {type: String, default: Date.now()},
})

module.exports = model("note", notes)