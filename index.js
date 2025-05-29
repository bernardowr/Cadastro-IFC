const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors({
    origin: '*'
}))

// Middleware para analisar JSON
app.use(express.json());

// Rota simples
app.get('/', (req, res) => {
    res.send('Servidor Express rodando! 🚀');
});

// Rota sobre
app.get('/sobre', (req, res) => {
    res.send('Esta é a página sobre!');
});

//Rota professores
app.get('/professores', (req, res) => {
    //Carrega o arquivo professores.json
    const professores = require('./public/professores.json');
    //envia o arquivo professores.json como resposta
    res.json(professores);
});

app.post('/professores', (req, res) => {
    console.log(req.body)
    res.send('A requisição POST para professores/ chegou: ' + req.body.nomeProfessor)
})

app.put('/professores', (req, res) => {
    console.log(req.body)
    res.send('A requisição PUT para professores/ chegou: ' + req.body.codigo)
})

app.delete('/professores', (req, res) => {
    console.log(req.body)
    res.send('A requisição DELETE para professores/ chegou: ' + req.body.codigo)
})

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});