var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/users/signup');
  console.log('Redirecionado para users/signup')
});

router.get('/:userid', function (req, res, next) {
  const userid = req.params.userid;

  if (userid !== 'signin' && userid !== 'signup') {
    res.render('other', { title: userid , content: "Seja bem-vindo " + userid});
    console.log('Usuário entrou em users/' + userid);
  } else {
    if (userid === 'signin') {
      res.render('other', { title: 'Sign In' , content: ""});
      console.log('Usuário entrou em users/signin')
    } else if (userid === 'signup') {
        res.render('other', { title: 'Sign Up' , content: "No link, coloque um nome junto do users. Por exemplo <b>/users/José Maia</b>, a estrutura é <b>http://localhost:PORTA/users/NOME</b>"});
        res.send
        console.log('Usuário entrou em users/signup')
    }
  }
});

module.exports = router;