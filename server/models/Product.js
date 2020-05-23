const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const ProductSchema = new Schema({
    image:{
        type: String,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    colour: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('product', ProductSchema)