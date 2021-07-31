const axios = require('axios')

exports.homeRoute = (req, res) => {
    axios.get('http://localhost:60/users')
         .then((response) => res.render('home', { users: response.data }))
         .catch((error) => res.send(error))
}

exports.addRoute = (req, res) => {
    res.render('add')
}

exports.updateRoute = (req, res) => {
    axios.get('http://localhost:60/users', { params: { id: req.query.id } })
         .then((response) => res.render('update', { user: response.data }))
         .catch((error) => res.send(error))
}