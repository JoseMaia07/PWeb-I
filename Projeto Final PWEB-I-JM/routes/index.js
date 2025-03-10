var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Rota para página de login
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

module.exports = router;
