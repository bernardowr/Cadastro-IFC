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

app.use('/', require('.routes'))

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});