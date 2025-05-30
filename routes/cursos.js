const express = require('express');
const router = express.Router();
const cursos = require('../public/cursos.json');

// Obter todos os cursos
router.get('/', (req, res) => {
    res.json(cursos);
});

// Obter um curso pelo código
router.get('/:id', (req, res) => {
    const curso = cursos[req.params.id]
    res.json(curso);
});

router.post('/', (req, res) => {
    console.log(req.body)
    res.send('A requisição POST para cursos/ chegou: ' + req.body.nomeProfessor)
})

router.put('/:id', (req, res) => {
    console.log(req.body)
    res.send('A requisição PUT para cursos/ chegou: ' + req.params.id)
})

router.delete('/:id', (req, res) => {
    console.log(req.body)
    res.send('A requisição DELETE para cursos/ chegou: ' + req.params.id)
})

module.exports = router;