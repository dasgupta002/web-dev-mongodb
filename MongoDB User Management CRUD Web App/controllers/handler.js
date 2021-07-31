const User = require('../models/user')

exports.createNewUser = (req, res) => {
    if(!req.body) {
        return res.status(400).send({ message: 'Contents can not be empty!' })
    } else {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            status: req.body.status
        })
        
        user.save()
            .then((data) => res.redirect('/add-user'))
            .catch((error) => res.status(500).send({ message: error.message }))
    }   
}

exports.findExistingUsers = (req, res) => {
    if(req.query.id) {
        const id = req.query.id
        User.findById(id)
            .then((data) => res.send(data))
            .catch((error) => res.status(500).send({ message: error.message }))
    } else {
        User.find()
            .then((data) => res.send(data))
            .catch((error) => res.status(500).send({ message: error.message }))
    }
}

exports.editExistingUser = (req, res) => {
    if(!req.body) {
        return res.status(400).send({ message: 'Contents can not be empty!' })
    } else {
        const id = req.params.id
        User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
            .then((data) => res.send({ message: 'User data updated!' }))
            .catch((error) => res.status(500).send({ message: error.message }))
    }
}

exports.deleteExistingUser = (req, res) => {
    const id = req.params.id
    User.findByIdAndDelete(id)
        .then((data) => res.send({ message: 'User deleted!' }))
        .catch((error) => res.status(500).send({ message: error.message }))
}