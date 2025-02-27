const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.URI;
const client = new MongoClient(uri);
const mydb = client.db('SkyrimDB').collection('postagens');

// =======================
// CONFIGURAÇÃO DO MULTER
// =======================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../images/uploads'); // Caminho absoluto
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
const upload = multer({ storage });
  

// =======================
// 1. CRIAR POSTAGEM
// =======================
router.get('/criar', (req, res) => {
  res.render('newpost');
});

router.post('/criar', upload.single('capa'), async (req, res) => {
  try {
    const { titulo, categoria, conteudo } = req.body;
    const capa = req.file ? `../images/uploads/${req.file.filename}` : '';

    // Verificando se o título já existe
    const tituloExistente = await mydb.findOne({ titulo });
    if (tituloExistente) {
      return res.send('Erro: Já existe uma postagem com este título.');
    }

    await mydb.insertOne({
      titulo,
      capa,
      categoria,
      conteudo
    });

    res.redirect('/posts');
  } catch (err) {
    console.error('Erro ao criar postagem:', err);
    res.send('Erro ao criar postagem.');
  }
});

// =======================
// 2. LER TODAS AS POSTAGENS
// =======================
router.get('/', async (req, res) => {
  try {
    const postagens = await mydb.find().toArray();
    res.render('posts', { postagens });
  } catch (err) {
    console.error('Erro ao buscar postagens:', err);
    res.send('Erro ao buscar postagens.');
  }
});

// =======================
// 3. LER UMA POSTAGEM PELO TÍTULO
// =======================
router.get('/:titulo', async (req, res) => {
  try {
    const titulo = req.params.titulo;
    const postagem = await mydb.findOne({ titulo });

    if (!postagem) {
      return res.send('Postagem não encontrada.');
    }

    res.render('post', { postagem });
  } catch (err) {
    console.error('Erro ao buscar postagem:', err);
    res.send('Erro ao buscar postagem.');
  }
});

// =======================
// 4. ATUALIZAR POSTAGEM
// =======================
router.get('/editar/:titulo', async (req, res) => {
  try {
    const titulo = req.params.titulo;
    const postagem = await mydb.findOne({ titulo });
    if (!postagem) {
      return res.send('Postagem não encontrada.');
    }
    res.render('editpost', { postagem });
  } catch (err) {
    console.error('Erro ao buscar postagem:', err);
    res.send('Erro ao buscar postagem.');
  }
});

router.post('/editar/:titulo', upload.single('capa'), async (req, res) => {
  try {
    const titulo = req.params.titulo;
    const { categoria, conteudo } = req.body;
    const capa = req.file ? `../images/uploads/${req.file.filename}` : req.body.existingCapa;

    await mydb.updateOne(
      { titulo },
      { $set: { capa, categoria, conteudo } }
    );

    res.redirect('/posts');
  } catch (err) {
    console.error('Erro ao atualizar postagem:', err);
    res.send('Erro ao atualizar postagem.');
  }
});

// =======================
// 5. DELETAR POSTAGEM PELO TÍTULO
// =======================
router.get('/deletar/:titulo', async (req, res) => {
  try {
    const titulo = req.params.titulo;
    await mydb.deleteOne({ titulo });
    res.redirect('/posts');
  } catch (err) {
    console.error('Erro ao deletar postagem:', err);
    res.send('Erro ao deletar postagem.');
  }
});

// =======================
// PESQUISAR POSTAGENS
// =======================
router.get('/pesquisar', async (req, res) => {
    try {
      const termo = req.query.q;
      console.log('Termo pesquisado:', termo); // Para verificar o termo no console
  
      if (!termo) {
        return res.redirect('/posts');
      }
  
      // Conectando ao banco de dados
      await client.connect();
      const mydb = client.db('SkyrimDB').collection('postagens');
  
      // Busca utilizando expressão regular para busca parcial (case insensitive)
      const query = {
        titulo: { $regex: termo, $options: 'i' }
      };
      console.log('Query utilizada:', query); // Para verificar a query no console
  
      const resultados = await mydb.find(query).toArray();
      console.log('Resultados encontrados:', resultados); // Para ver os resultados no console
  
      res.render('pesquisa', { resultados, termo });
    } catch (err) {
      console.error('Erro ao buscar postagens:', err);
      res.send('Erro ao buscar postagens.');
    }
});
  
  
module.exports = router;
