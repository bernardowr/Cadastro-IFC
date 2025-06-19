const Professor = require('../models/Professor')

exports.getProfessores = async (req, res) => {
    try {
        const professores = await Professor.getAll()
        res.json(professores)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getProfessor = async (req, res) => {
    const id = req.params.id
    try {
        const professor = await Professor.getById(id)
        console.log(professor)
        res.json(professor)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.insereProfessor = async (req, res) => {
    try {
        const { nome, email, sala } = req.body
        const professor = await Professor.insert({ nome, email, sala })
        res.status(201).json(professor)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.updateProfessor = async (req, res) => {
    const id = req.params.id
    try {
        const { nome, email, sala } = req.body
        const professor = await Professor.update(id, nome, email, sala)
        console.log(professor)
        res.json(professor)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.deleteProfessor = async (req, res) => {
    const id = req.params.id
    try {
        const professor = await Professor.delete(id)
        res.json({ message: 'Professor deletado com sucesso', id })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
