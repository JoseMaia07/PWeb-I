require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log('MongoDB conectado...');

    const db = client.db();
    global.db = db;
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
  }
}

connectDB();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Importando as rotas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts'); // Rota para as postagens

var app = express();

// =======================
// Configuração do EJS
// =======================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// =======================
// Middlewares
// =======================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// =======================
// Rotas
// =======================
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter); // Rota para as postagens

// =======================
// Rota 404 e Handler de Erros
// =======================
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
