const express = require('express');
const app = express();
const port = 3000;
app.use(express.urlencoded({extended: true}));
app.use(express.json());

let livros = [
    { id: 1, titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', editora: 'HarperCollins', ano: 1954, quant: 10, preco: 99.90 },
    { id: 2, titulo: 'Harry Potter e a Pedra Filosofal', autor: 'J.K. Rowling', editora: 'Rocco', ano: 2020, quant: 5, preco: 186.90 },
    { id: 3, titulo: 'A Game of Thrones', autor: 'George R.R. Martin', editora: 'Leya', ano: 1996, quant: 0, preco: 79.90 },
    { id: 4, titulo: '1984', autor: 'George Orwell', editora: 'Excelsior', ano: 2021, quant: 8, preco: 50.90 },
    { id: 5, titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', editora: 'HarperCollins', ano: 1937, quant: 3, preco: 29.90 },
    { id: 6, titulo: 'O Nome do Vento (A Crônica do Matador do Rei – Livro 1)', autor: 'Patrick Rothfuss', editora: 'Arqueiro', ano: 2009, quant: 2, preco: 60.00}
];

app.post("/livros", (req, res) => {
    const { titulo, autor, editora, ano, quant, preco } = req.body;
    const newBook = {
        id: livros.length + 1,
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

app.get("/livros", (req, res) => {
    res.json(livros);
});

app.get("/livros/:id", (req, res) => {
    const livro = livros.find(l => l.id === parseInt(req.params.id));
    if (livro) {
        res.json(livro);
    } else {
        res.status(404).json({ message: "Livro não encontrado" });
    }
});

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

app.delete("/livros/:id", (req, res) => {
    const livroIndex = livros.findIndex(l => l.id === parseInt(req.params.id));
    if (livroIndex !== -1) {
        livros.splice(livroIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Livro não encontrado" });
    }
});

app.get("/livros/editora/:editora", (req, res) => {
    const editora = req.params.editora;
    const livrosEditora = livros.filter(l => l.editora.toLowerCase() === editora.toLowerCase());
    if (livrosEditora.length > 0) {
        res.json(livrosEditora);
    } else {
        res.status(404).json({ message: "Nenhum livro encontrado para essa editora" });
    }
});

app.get("/livros/titulo/:palavraChave", (req, res) => {
    const palavraChave = req.params.palavraChave.toLowerCase();
    const livrosFiltrados = livros.filter(l => l.titulo.toLowerCase().includes(palavraChave));
    if (livrosFiltrados.length > 0) {
        res.json(livrosFiltrados);
    } else {
        res.status(404).json({ message: "Nenhum livro encontrado com essa palavra-chave" });
    }
});

app.get("/livros/maior-que/:preco", (req, res) => {
    const preco = parseFloat(req.params.preco);
    const livrosAcimaPreco = livros.filter(l => l.preco > preco);
    res.json(livrosAcimaPreco);
});

app.get("/livros/menor-que/:preco", (req, res) => {
    const preco = parseFloat(req.params.preco);
    const livrosAbaixoPreco = livros.filter(l => l.preco < preco);
    res.json(livrosAbaixoPreco);
});

app.get("/livros/mais-recentes", (req, res) => {
    const livrosOrdenados = livros.sort((a, b) => b.ano - a.ano);
    res.json(livrosOrdenados);
});

app.get("/livros/mais-antigos", (req, res) => {
    const livrosOrdenados = livros.sort((a, b) => a.ano - b.ano);
    res.json(livrosOrdenados);
});

app.get("/livros/sem-estoque", (req, res) => {
    const livrosSemEstoque = livros.filter(l => l.quant === 0);
    res.json(livrosSemEstoque);
});

app.use((req, res) => {
    res.status(404).json({ message: "Endpoint não encontrado" });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

