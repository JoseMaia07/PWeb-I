const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
require('dotenv').config()
const uri = process.env.URI
const client = new MongoClient(uri)
const mydb = client.db('mydb').collection('users')
const usersDAO = require('./usersDAO')

app.listen(3001, () => {
    console.log("Servidor rodando...")
})

app.get('/all', async (req, res) => {
    const docs = await usersDAO.getUsers(mydb)
    res.json(JSON.parse(JSON.stringify(docs, null, 2)))
})

app.get('/add/:n/:e/:s', async (req, res) => {
    const doc = {
        nome: req.params.n,
        email: req.params.e,
        senha: req.params.s
    }
    const result = await usersDAO.insertUser(mydb, doc)
    res.json(result)
})

app.get('/del/:n', async (req, res) => {
    const name = {
        nome: req.params.n
    }
    const result = await usersDAO.deleteUserByName(mydb, name)
    res.json(result)
})

app.get('/update/:e/:n', async (req, res) => {
    const old_email = {
        email: req.params.e
    }
    const new_name = {
        $set : {nome: req.params.n}
    }
    const result = await usersDAO.updateNameByEmail(mydb, old_email, new_name)
    res.json(result)
})

app.get('/update/:e/:s', async (req, res) => {
    const old_email = {
        email: req.params.e
    }
    const new_pass = {
        $set : {senha: req.params.s}
    }
    const result = await usersDAO.updatePasswordByEmail(mydb, old_email, new_pass)
    res.json(result)
})

