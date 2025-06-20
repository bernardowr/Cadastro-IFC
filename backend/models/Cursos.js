const { query } = require('../config/db')

class Curso {
    static async getAll() {
        const result = await query(
            `SELECT id, nome, sigla, descricao, nome_coordenador as coordenador
             FROM public.cursos
             ORDER BY nome`
        );
        return result.rows;
    }

    static async getById(id) {
        const result = await query(
            `SELECT id, nome, sigla, descricao, nome_coordenador as coordenador
             FROM public.cursos
             WHERE id = $1`, [id]
        );
        return result.rows[0];
    }

    static async insert({ nome, sigla, descricao, coordenador }) {
        const result = await query(
            `INSERT INTO public.cursos (nome, sigla, descricao, nome_coordenador)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [nome, sigla, descricao, coordenador]
        );
        return result.rows[0];
    }

    static async update(id, nome, sigla, descricao, coordenador) {
        const result = await query(
            `UPDATE public.cursos
             SET nome = $2, sigla = $3, descricao = $4, nome_coordenador = $5
             WHERE id = $1 RETURNING *`,
            [id, nome, sigla, descricao, coordenador]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await query(
            `DELETE FROM public.cursos WHERE id = $1 RETURNING *`, [id]
        );
        return result.rows[0];
    }
}

module.exports = Curso