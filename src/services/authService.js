import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";
import { AppError } from "../utils/errorHandler.js";

class AuthService {
  async login(usuario_acesso, senha) {
    try {
      const [rows] = await pool.execute(
        `SELECT id_aluno, nome_completo, usuario_acesso, email_aluno, 
                senha_hash, observacao, data_cadastro 
         FROM alunos 
         WHERE usuario_acesso = ?`,
        [usuario_acesso.trim().toLowerCase()],
      );

      if (rows.length === 0) {
        throw new AppError("Usuário ou senha incorretos", 401);
      }

      const aluno = rows[0];

      const senhaValida = await bcrypt.compare(senha, aluno.senha_hash);

      if (!senhaValida) {
        throw new AppError("Usuário ou senha incorretos", 401);
      }

      const token = this.gerarToken({
        id_aluno: aluno.id_aluno,
        usuario_acesso: aluno.usuario_acesso,
        email_aluno: aluno.email_aluno,
      });

      const { senha_hash, ...alunoSemSenha } = aluno;

      return {
        aluno: alunoSemSenha,
        token,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("Erro ao fazer login:", error);
      throw new AppError("Erro ao fazer login", 500);
    }
  }

  gerarToken(payload) {
    const secret = "chave-secreta";
    const expiresIn = "7d";

    if (!secret) {
      throw new Error("JWT_SECRET não configurado nas variáveis de ambiente");
    }

    return jwt.sign(payload, secret, { expiresIn });
  }

  verificarToken(token) {
    const secret = "chave-secreta";

    if (!secret) {
      throw new Error("JWT_SECRET não configurado nas variáveis de ambiente");
    }

    try {
      return jwt.verify(token, secret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AppError("Token expirado", 401);
      }
      if (error.name === "JsonWebTokenError") {
        throw new AppError("Token inválido", 401);
      }
      throw new AppError("Erro ao verificar token", 401);
    }
  }
}

export default new AuthService();
