import authService from "../services/authService.js";
import { AppError } from "../utils/errorHandler.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token não fornecido", 401);
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      throw new AppError("Formato de token inválido", 401);
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      throw new AppError("Token mal formatado", 401);
    }

    const decoded = authService.verificarToken(token);
    req.usuario_autenticado = {
      id_aluno: decoded.id_aluno,
      usuario_acesso: decoded.usuario_acesso,
      email_aluno: decoded.email_aluno,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Falha na autenticação",
    });
  }
};
