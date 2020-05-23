const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const profileImgUpload = require('../utils/image-upload')

// load product model
require('../models/Product')
const Product = mongoose.model('product')

// index route
router.get('/', (req, res) => {
    res.send('welcome')
})

// response status code
const OK = 200
const NOT_FOUND = 404

// add product route
router.post('/add', (req, res) => {
    let errors = []
    // check form errors
    if(!req.body.image){
        errors.push({text:'Please add a title'})
    }
    if(!req.body.name){
        errors.push({text:'Please add a name'})
    }
    if(!req.body.quantity){
        errors.push({text:'Please add a quantity'})
    }
    if(!req.body.price){
        errors.push({text:'Please add a price'})
    }
    if(!req.body.colour){
        errors.push({text:'Please add a colour'})
    }

    // send errors or add product to database when no error found
    if(errors.length > 0){
        res.status(OK).json(errors)
    } else {
        const newProduct = {
            image: req.body.image,
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
            colour: req.body.colour
        }
        try{
            new Product(newProduct).save()
            .then(() => res.status(OK).json({text: "Success"}))
        }catch(err) {
            res.json({
                text: "save product failed",
                trace: err
            })
        }
    }
})

// get all products route
router.get('/products', (req, res) => {
    try{
        Product.find()
        .sort({date: 'desc'})
        .then(products => res.status(OK).json(products))
    }catch(err) {
        res.json({
            text: "get products failed",
            trace: err
        })
    }
})

// search for a product by key word
router.get('/products/search/:keyword', (req, res) => {
    console.log(req.params)
    if(req.params.keyword !== null){
        Product.find({
            name: `/${req.params.keyword}/`
        }).then(products => res.send(products))
    }
    
})

// get one product by id when editing
router.get('/products/edit/:id', (req, res) => {
    try{
        Product.findOne({
            _id: req.params.id
        })
        .then(product => res.status(OK).json(product))
    }catch(err) {
        res.json({
            text: "find product failed",
            trace: err
        })
    }
})

// edit a product
router.put('/products/edit/:id', (req, res) => {
    try{
        Product.findOne({_id: req.params.id})
        .then(product => {
            product.image = req.body.image
            product.name = req.body.name
            product.quantity = req.body.quantity
            product.price = req.body.price
            product.colour = req.body.colour
    
            product.save()
            .then(product => {
                res.status(OK).json(product)
            })
        })
    }catch(err) {
        res.json({
            text: "edit product failed",
            trace: err
        })
    }
})

// delete one product by id
router.post('/products/:id', (req, res) => {
    try{
        Product.remove({_id: req.params.id})
        .then(info => res.status(OK).json(info))
    }catch(err) {
        res.json({
            text: "delete product failed",
            trace: err
        })
    }
})

// upload product image to aws s3
router.post('/upload-image', (req, res) => {
    profileImgUpload(req, res, err => {
        if(err){
            console.log('Upload failed: ' + err)
            res.json({error: err})
        } else{
            if(req.file === undefined){
                console.log('Error: noFile Selected')
                res.json({'Error': 'No File Selected'})
            } else {
                const imageName = req.file.key
                const imageLocation = req.file.imageLocation
                res.json({
                    image: imageName,
                    location: imageLocation
                })
            }
        }
        
    })
})

module.exports = router