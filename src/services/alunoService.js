import bcrypt from "bcrypt";
import { pool } from "../config/database.js";
import { AppError } from "../utils/errorHandler.js";

class AlunoService {
  async criarAluno(dadosAluno) {
    const { nome_completo, usuario_acesso, senha, email_aluno, observacao } =
      dadosAluno;
    const usuarioExiste = await this.verificarUsuarioExiste(usuario_acesso);
    if (usuarioExiste) {
      throw new AppError("Usuário de acesso já está em uso", 409);
    }

    const emailExiste = await this.verificarEmailExiste(email_aluno);
    if (emailExiste) {
      throw new AppError("Email já está em uso", 409);
    }

    const bcryptRounds = 10;
    const senha_hash = await bcrypt.hash(senha, bcryptRounds);

    try {
      const [result] = await pool.execute(
        `INSERT INTO alunos 
         (nome_completo, usuario_acesso, senha_hash, email_aluno, observacao) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          nome_completo.trim(),
          usuario_acesso.trim().toLowerCase(),
          senha_hash,
          email_aluno.trim().toLowerCase(),
          observacao ? observacao.trim() : null,
        ],
      );

      const alunoInserido = await this.buscarAlunoPorId(result.insertId);

      return alunoInserido;
    } catch (error) {
      console.error("Erro ao inserir aluno:", error);
      throw new AppError("Erro ao criar aluno no banco de dados", 500);
    }
  }

  async buscarAlunoPorId(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT id_aluno, nome_completo, usuario_acesso, email_aluno, 
                observacao, data_cadastro 
         FROM alunos 
         WHERE id_aluno = ?`,
        [id],
      );

      if (rows.length === 0) {
        throw new AppError("Aluno não encontrado", 404);
      }

      return rows[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("Erro ao buscar aluno:", error);
      throw new AppError("Erro ao buscar aluno no banco de dados", 500);
    }
  }

  async listarAlunos() {
    try {
      const [rows] = await pool.execute(
        `SELECT id_aluno, nome_completo, usuario_acesso, email_aluno, 
                observacao, data_cadastro 
         FROM alunos 
         ORDER BY data_cadastro DESC`,
      );

      const [countResult] = await pool.execute(
        "SELECT COUNT(*) as total FROM alunos",
      );

      return {
        alunos: rows,
        total: countResult[0].total,
      };
    } catch (error) {
      console.error("Erro ao listar alunos:", error);
      throw new AppError("Erro ao listar alunos", 500);
    }
  }

  async verificarUsuarioExiste(usuario_acesso) {
    try {
      const [rows] = await pool.execute(
        "SELECT id_aluno FROM alunos WHERE usuario_acesso = ?",
        [usuario_acesso.trim().toLowerCase()],
      );
      return rows.length > 0;
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      throw new AppError("Erro ao verificar usuário", 500);
    }
  }

  async verificarEmailExiste(email_aluno) {
    try {
      const [rows] = await pool.execute(
        "SELECT id_aluno FROM alunos WHERE email_aluno = ?",
        [email_aluno.trim().toLowerCase()],
      );
      return rows.length > 0;
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      throw new AppError("Erro ao verificar email", 500);
    }
  }

  async atualizarAluno(id, id_aluno_autenticado, dadosAtualizacao) {
    if (parseInt(id) !== parseInt(id_aluno_autenticado)) {
      throw new AppError("Você só pode atualizar seus próprios dados", 403);
    }

    const alunoExistente = await this.buscarAlunoPorId(id);

    const { nome_completo, usuario_acesso, senha, email_aluno, observacao } =
      dadosAtualizacao;

    if (
      usuario_acesso &&
      usuario_acesso.toLowerCase() !== alunoExistente.usuario_acesso
    ) {
      const usuarioExiste = await this.verificarUsuarioExiste(usuario_acesso);
      if (usuarioExiste) {
        throw new AppError("Usuário de acesso já está em uso", 409);
      }
    }

    if (
      email_aluno &&
      email_aluno.toLowerCase() !== alunoExistente.email_aluno
    ) {
      const emailExiste = await this.verificarEmailExiste(email_aluno);
      if (emailExiste) {
        throw new AppError("Email já está em uso", 409);
      }
    }

    const camposParaAtualizar = [];
    const valoresParaAtualizar = [];

    if (nome_completo) {
      camposParaAtualizar.push("nome_completo = ?");
      valoresParaAtualizar.push(nome_completo.trim());
    }

    if (usuario_acesso) {
      camposParaAtualizar.push("usuario_acesso = ?");
      valoresParaAtualizar.push(usuario_acesso.trim().toLowerCase());
    }

    if (senha) {
      const bcryptRounds = 10;
      const senha_hash = await bcrypt.hash(senha, bcryptRounds);
      camposParaAtualizar.push("senha_hash = ?");
      valoresParaAtualizar.push(senha_hash);
    }

    if (email_aluno) {
      camposParaAtualizar.push("email_aluno = ?");
      valoresParaAtualizar.push(email_aluno.trim().toLowerCase());
    }

    if (observacao !== undefined) {
      camposParaAtualizar.push("observacao = ?");
      valoresParaAtualizar.push(observacao ? observacao.trim() : null);
    }

    if (camposParaAtualizar.length === 0) {
      throw new AppError("Nenhum campo para atualizar", 400);
    }

    valoresParaAtualizar.push(id);

    try {
      await pool.execute(
        `UPDATE alunos SET ${camposParaAtualizar.join(
          ", ",
        )} WHERE id_aluno = ?`,
        valoresParaAtualizar,
      );

      const alunoAtualizado = await this.buscarAlunoPorId(id);

      return alunoAtualizado;
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      throw new AppError("Erro ao atualizar aluno no banco de dados", 500);
    }
  }

  async deletarAluno(id, id_aluno_autenticado) {
    if (parseInt(id) !== parseInt(id_aluno_autenticado)) {
      throw new AppError("Você só pode deletar sua própria conta", 403);
    }

    await this.buscarAlunoPorId(id);

    try {
      await pool.execute("DELETE FROM alunos WHERE id_aluno = ?", [id]);

      return { message: "Conta deletada com sucesso" };
    } catch (error) {
      console.error("Erro ao deletar aluno:", error);
      throw new AppError("Erro ao deletar aluno do banco de dados", 500);
    }
  }
}

export default new AlunoService();
