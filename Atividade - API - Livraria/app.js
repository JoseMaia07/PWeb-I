const express = require('express');
const app = express();
const port = 3000;

// Middleware para analisar o corpo da requisição em formato JSON
app.use(express.json());

// Banco de dados fictício de livros
let livros = [
    { id: 1, titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', editora: 'HarperCollins', ano: 1954, quant: 10, preco: 99.90 },
    { id: 2, titulo: 'Harry Potter e a Pedra Filosofal', autor: 'J.K. Rowling', editora: 'Rocco', ano: 2020, quant: 5, preco: 186.90 },
    { id: 3, titulo: 'A Game of Thrones', autor: 'George R.R. Martin', editora: 'Leya', ano: 1996, quant: 0, preco: 79.90 },
    { id: 4, titulo: '1984', autor: 'George Orwell', editora: 'Excelsior', ano: 2021, quant: 8, preco: 50.90 },
    { id: 5, titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', editora: 'HarperCollins', ano: 1937, quant: 3, preco: 29.90 },
    { id: 6, titulo: 'O Nome do Vento (A Crônica do Matador do Rei – Livro 1)', autor: 'Patrick Rothfuss', editora: 'Arqueiro', ano: 2009, quant: 2, preco: 60.00}
];

// CRUD - Criar um novo livro
app.post("/livros", (req, res) => {
    const { titulo, autor, editora, ano, quant, preco } = req.body;
    const newBook = {
        id: livros.length + 1, // ID simples baseado no tamanho do array
        titulo, 
        autor, 
        editora, 
        ano, 
        quant, 
        preco
    };
    livros.push(newBook);
    res.status(201).json(newBook);
});

// CRUD - Ler todos os livros
app.get("/livros", (req, res) => {
    res.json(livros);
});

// CRUD - Ler um livro específico pelo ID
app.get("/livros/:id", (req, res) => {
    const livro = livros.find(l => l.id === parseInt(req.params.id));
    if (livro) {
        res.json(livro);
    } else {
        res.status(404).json({ message: "Livro não encontrado" });
    }
});

// CRUD - Atualizar um livro pelo ID
app.put("/livros/:id", (req, res) => {
    const livroIndex = livros.findIndex(l => l.id === parseInt(req.params.id));
    if (livroIndex !== -1) {
        const { titulo, autor, editora, ano, quant, preco } = req.body;
        livros[livroIndex] = {
            id: parseInt(req.params.id),
            titulo, 
            autor, 
            editora, 
            ano, 
            quant, 
            preco
        };
        res.json(livros[livroIndex]);
    } else {
        res.status(404).json({ message: "Livro não encontrado" });
    }
});

// CRUD - Deletar um livro pelo ID
app.delete("/livros/:id", (req, res) => {
    const livroIndex = livros.findIndex(l => l.id === parseInt(req.params.id));
    if (livroIndex !== -1) {
        livros.splice(livroIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Livro não encontrado" });
    }
});

// Buscar livros por editora
app.get("/livros/editora/:editora", (req, res) => {
    const editora = req.params.editora;
    const livrosEditora = livros.filter(l => l.editora.toLowerCase() === editora.toLowerCase());
    if (livrosEditora.length > 0) {
        res.json(livrosEditora);
    } else {
        res.status(404).json({ message: "Nenhum livro encontrado para essa editora" });
    }
});

// Buscar livros por palavra-chave no título
app.get("/livros/titulo/:palavraChave", (req, res) => {
    const palavraChave = req.params.palavraChave.toLowerCase();
    const livrosFiltrados = livros.filter(l => l.titulo.toLowerCase().includes(palavraChave));
    if (livrosFiltrados.length > 0) {
        res.json(livrosFiltrados);
    } else {
        res.status(404).json({ message: "Nenhum livro encontrado com essa palavra-chave" });
    }
});

// Buscar livros acima de um determinado preço
app.get("/livros/maior-que/:preco", (req, res) => {
    const preco = parseFloat(req.params.preco);
    const livrosAcimaPreco = livros.filter(l => l.preco > preco);
    res.json(livrosAcimaPreco);
});

// Buscar livros abaixo de um determinado preço
app.get("/livros/menor-que/:preco", (req, res) => {
    const preco = parseFloat(req.params.preco);
    const livrosAbaixoPreco = livros.filter(l => l.preco < preco);
    res.json(livrosAbaixoPreco);
});

// Buscar livros mais recentes
app.get("/livros/mais-recentes", (req, res) => {
    const livrosOrdenados = livros.sort((a, b) => b.ano - a.ano);
    res.json(livrosOrdenados);
});

// Buscar livros mais antigos
app.get("/livros/mais-antigos", (req, res) => {
    const livrosOrdenados = livros.sort((a, b) => a.ano - b.ano);
    res.json(livrosOrdenados);
});

// Buscar livros sem estoque
app.get("/livros/sem-estoque", (req, res) => {
    const livrosSemEstoque = livros.filter(l => l.quant === 0);
    res.json(livrosSemEstoque);
});

// Endpoint inexistente (erro 404)
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint não encontrado" });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
