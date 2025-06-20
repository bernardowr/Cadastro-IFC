const { query } = require('../config/db')

class Professor {
  static async getAll() {
    const result = await query(
      `SELECT p.id as codigo, p.nome as nomeprofessor, p.email, s.descricao as sala
       FROM public.professor p
       LEFT JOIN public.sala s ON p.fk_sala_id_sala = s.id ORDER BY p.nome`
    )
    return result.rows
  }

  static async getById(id) {
    const result = await query(
      `SELECT id FROM public.professor WHERE id = $1`, [id]
    )
    return result.rows
  }

  static async insert({ nome, email, sala }) {
    // 1. Cria o professor sem sala
    const profResult = await query(
      `INSERT INTO public.professor (nome, email) VALUES ($1, $2) RETURNING id, nome`,
      [nome, email]
    );
    const professorId = profResult.rows[0].id;
    const professorNome = profResult.rows[0].nome;

    // 2. Cria a sala vinculando ao professor
    const salaResult = await query(
      `INSERT INTO public.sala (descricao, professor_id) VALUES ($1, $2) RETURNING id`,
      [sala, professorId]
    );
    const salaId = salaResult.rows[0].id;

    // 3. Atualiza o professor com o id da sala
    await query(
      `UPDATE public.professor SET fk_sala_id_sala = $1 WHERE id = $2`,
      [salaId, professorId]
    );

    // 4. Retorna o professor criado
    return { id: professorId, nome, email, salaId };
  }

  static async update(id, nome, email, sala) {
    // 1. Verifica se a sala já existe
    let salaResult = await query(
      `SELECT id FROM public.sala WHERE descricao = $1`, [sala]
    );

    let salaId;
    if (salaResult.rows.length > 0) {
      salaId = salaResult.rows[0].id;
      await query(
        `UPDATE public.sala SET professor_id = $1 WHERE id = $2`,
        [id, salaId]
      );
    } else {
      const insertSala = await query(
        `INSERT INTO public.sala (descricao, professor_id) VALUES ($1, $2) RETURNING id`,
        [sala, id]
      );
      salaId = insertSala.rows[0].id;
    }

    // 2. Atualiza o professor com o id da sala
    const result = await query(
      `UPDATE public.professor SET nome = $2, email = $3, fk_sala_id_sala = $4 WHERE id = $1 RETURNING *`,
      [id, nome, email, salaId]
    );
    return result.rows[0];
  }

  static async delete(id) {
    // Busca o nome do professor antes de deletar
    const profResult = await query(
      `SELECT nome FROM public.professor WHERE id = $1`, [id]
    );
    if (profResult.rows.length === 0) return null;
    const professorNome = profResult.rows[0].nome;

    // Remove o vínculo do professor nos cursos (agora por nome_coordenador)
    await query(
      `UPDATE public.cursos SET nome_coordenador = NULL WHERE nome_coordenador = $1`, [professorNome]
    );

    // Remove o vínculo do professor nas salas
    await query(
      `UPDATE public.sala SET professor_id = NULL WHERE professor_id = $1`, [id]
    );

    // Agora deleta o professor
    const result = await query(
      `DELETE FROM public.professor WHERE id = $1 RETURNING *`, [id]
    );
    return result.rows[0];
  }
}

module.exports = Professor