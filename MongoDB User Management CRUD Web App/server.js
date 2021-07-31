const express = require('express')
const morgan = require('morgan')
const path = require('path')

const dotenv = require('dotenv')
dotenv.config({ path: 'config.env' })

const app = express()

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

app.use(morgan('short'))
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.use('/css', express.static(path.resolve(__dirname, 'assets/css')))
app.use('/js', express.static(path.resolve(__dirname, 'assets/js')))

const appRouter = require('./routes/main')
app.use('/', appRouter)

const PORT = process.env.PORT || 8080
app.listen(PORT)