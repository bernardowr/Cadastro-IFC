const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors({
    origin: '*'
}))

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

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});