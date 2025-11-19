import authService from "../services/authService.js";
import { asyncHandler, AppError } from "../utils/errorHandler.js";

class AuthController {
  login = asyncHandler(async (req, res) => {
    const { usuario_acesso, senha } = req.body;
    if (!usuario_acesso || usuario_acesso.trim().length === 0) {
      throw new AppError("Campo usuario_acesso é obrigatório", 400);
    }

    if (!senha || senha.length === 0) {
      throw new AppError("Campo senha é obrigatório", 400);
    }

    const resultado = await authService.login(usuario_acesso, senha);

    res.status(200).json({
      success: true,
      message: "Login realizado com sucesso",
      data: resultado,
    });
  });

  me = asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      data: req.usuario_autenticado,
    });
  });
}

export default new AuthController();
