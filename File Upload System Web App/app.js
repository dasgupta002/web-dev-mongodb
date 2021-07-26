const express = require('express')
const path = require('path')
const crypto = require('crypto')
const mongoose = require('mongoose')
const multer = require('multer')
const stream = require('gridfs-stream')
const parser = require('body-parser')
const override = require('method-override')

const { GridFsStorage } = require('multer-gridfs-storage')

const app = express()

app.use(parser.json())

app.use(override('_method'))

app.set('view engine', 'ejs')

const conn = mongoose.createConnection('mongodb+srv://dg:500@cluster0.9adak.mongodb.net/files?retryWrites=true&w=majority')

conn.once('open', () => {
    const grid = stream(conn.db, mongoose.mongo)
    grid.collection('uploads')

    app.get('/', (req, res) => {
        grid.files.find().toArray((error, files) => {
            if(files.length == 0) {
                return res.render('home', { files: false })
            } else {
                files.map((file) => {
                    if(file.contentType == 'image/jpeg' || file.contentType == 'image/png') {
                        file.isImage = true
                    } else {
                        file.isImage = false
                    }
                })

                return res.render('home', { files: files })
            }
        })
    })

    app.get('/files', (req, res) => {
        grid.files.find().toArray((error, files) => {
            if(files.length == 0) {
                return res.status(404).json({'error': 'No files found on dumpyard!'})
            } else {
                return res.json(files)
            }
        })
    })

    app.delete('/files/:id', (req, res) => {
        grid.files.find().toArray((error, files) => {
            grid.remove({ _id: req.params.id, root: 'uploads' }, (error, store) => {
                if(error) {
                    return res.status(404).json({ 'error': error.message })
                } else {
                    return res.redirect('/')
                }
            })
        })
    })
    
    app.get('/files/:filename', (req, res) => {
        grid.files.findOne({ filename: req.params.filename }, (error, file) => {
            if(!file) {
                return res.status(404).json({'error': 'None such file found on dumpyard!'})
            } else {
                return res.json(file)
            }
        })
    })
    
    app.get('/images/:filename', (req, res) => {
        grid.files.findOne({ filename: req.params.filename }, (error, file) => {
            if(!file) {
                return res.status(404).json({'error': 'None such file found on dumpyard!'})
            } 
            
            if(file.contentType == 'image/jpeg' || file.contentType == 'image/png') {
                const readstream = grid.createReadStream(file.filename)
                return readstream.pipe(res)
            } else {
                return res.status(404).json({'error': 'Requested file is not an image!'})
            }
        })
    })
})

const storage  = new GridFsStorage({
    url: 'mongodb+srv://dg:500@cluster0.9adak.mongodb.net/files?retryWrites=true&w=majority',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (error, buffer) => {
                if(error) {
                    return reject(error)
                } else {
                    const filename = buffer.toString('hex') + path.extname(file.originalname)
                    const fileinfo = { 
                        filename: filename,
                        bucketName: 'uploads'
                    }

                    resolve(fileinfo)
                }
            })
        })
    }
})

const upload = multer({ storage })

app.post('/upload', upload.single('file') , (req, res) => {
    res.redirect('/')
})

app.listen(60)