const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursosController');

router.get('/', cursosController.getCursos);
router.get('/:id', cursosController.getCurso);
router.post('/', cursosController.insereCurso);
router.put('/:id', cursosController.updateCurso);
router.delete('/:id', cursosController.deleteCurso);

module.exports = router;