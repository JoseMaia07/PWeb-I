const express = require('express');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const router = express.Router();
require('dotenv').config();
const uri = process.env.URI;
const client = new MongoClient(uri);
const mydb = client.db('SkyrimDB').collection('usuarios');

// =======================
// PÁGINA DE CADASTRO
// =======================
router.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

// =======================
// CADASTRO DE USUÁRIO
// =======================
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  
  try {
    await client.connect();
    const mydb = client.db('SkyrimDB').collection('usuarios');

    // Verifica se o email já está cadastrado
    const usuarioExistente = await mydb.findOne({ email });
    if (usuarioExistente) {
      return res.send('Email já cadastrado');
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Insere o usuário no banco de dados
    await mydb.insertOne({ nome, email, senha: senhaCriptografada });
    res.redirect('/login');
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.send('Erro ao cadastrar usuário.');
  }
});

// =======================
// PÁGINA DE LOGIN
// =======================
router.get('/login', (req, res) => {
  res.render('login');
});

// =======================
// LOGIN DE USUÁRIO
// =======================
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    await client.connect();
    const mydb = client.db('SkyrimDB').collection('usuarios');
    const usuario = await mydb.findOne({ email });

    if (!usuario) {
      return res.send('Usuário não encontrado');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.send('Senha incorreta');
    }

    res.redirect('/');
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.send('Erro ao fazer login.');
  }
});

// Rota para página de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Rota para autenticar o login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    // Conectando ao banco de dados
    await client.connect();
    const mydb = client.db('SkyrimDB').collection('usuarios');
    
    // Verificando se o usuário existe
    const usuario = await mydb.findOne({ email: email, senha: senha });

    if (usuario) {
      console.log('Login bem-sucedido:', email);
      return res.redirect('/'); // Redireciona para o index após login
    } else {
      console.log('Usuário ou senha inválidos');
      return res.send('Usuário ou senha inválidos');
    }
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.send('Erro ao fazer login.');
  }
});

module.exports = router;
