const http = require('http');
const server = http.createServer((req, res) => {

    console.log("Servido ativo");

    const headers = req.headers;
    const method = req.method;
    const url = req.url;

    res.setHeader('Content-Type', 'text/html');
    res.write('<!DOCTYPE HTML>')
    res.write('<html lang="pt">');
    res.write('<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>');
    res.write('<body>');
    res.write('<h1>Dados de Conexão</h1>');
    res.write('<div class="container1">');
    res.write('<p>');
    res.write('headers: <br>' + JSON.stringify(headers) + '</br>');
    res.write('</p>');
    res.write('<p>');
    res.write('method: <br>' + method + '</br>');
    res.write('</p>');
    res.write('<p>');
    res.write('URL: <br>' + url + '</br></div>');
    res.write('</p>');
    res.write('<style type="text/css">');
    res.write('div {font-size: 16px; font-weight: bold; margin: 5px;} body {background-color: #151218; color: #fff;}');
    res.write('</style>');

    res.write('</body></html>');
    res.end();
});

server.listen(3000);