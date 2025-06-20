const Curso = require('../models/Cursos');

exports.getCursos = async (req, res) => {
    try {
        const cursos = await Curso.getAll();
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCurso = async (req, res) => {
    const id = req.params.id;
    try {
        const curso = await Curso.getById(id);
        res.json(curso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.insereCurso = async (req, res) => {
    try {
        const { nome, sigla, descricao, coordenador } = req.body;
        const curso = await Curso.insert({ nome, sigla, descricao, coordenador });
        res.status(201).json(curso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCurso = async (req, res) => {
    const id = req.params.id;
    try {
        const { nome, sigla, descricao, coordenador } = req.body;
        const curso = await Curso.update(id, nome, sigla, descricao, coordenador);
        res.json(curso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCurso = async (req, res) => {
    const id = req.params.id;
    try {
        await Curso.delete(id);
        res.json({ message: 'Curso deletado com sucesso', id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};