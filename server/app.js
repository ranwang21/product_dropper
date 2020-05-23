const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const app = express()
const connectDB = require('./config/db')
const router = require('./routes/index')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())
app.use(express.static('dist'))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

// response status code
const OK = 200
const NOT_FOUND = 404

// use routes
app.use('/', router)

// database connection
connectDB();
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server start on port ${port}`))