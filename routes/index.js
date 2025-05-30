const express = require('express');
const router = express.Router();
// Importando as rotas de cursos e professores

//rota para professores
router.use('/professores', require('./professores'));

//rota para cursos
router.use('/cursos', require('./cursos'));


module.exports = router;