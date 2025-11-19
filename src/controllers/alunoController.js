import alunoService from "../services/alunoService.js";
import {
  validateAlunoData,
  validateAlunoUpdateData,
} from "../utils/validators.js";
import { asyncHandler, AppError } from "../utils/errorHandler.js";

class AlunoController {
  criarAluno = asyncHandler(async (req, res) => {
    const validation = validateAlunoData(req.body);

    if (!validation.isValid) {
      throw new AppError("Dados inválidos", 400, validation.errors);
    }

    const aluno = await alunoService.criarAluno(req.body);
    res.status(201).json({
      success: true,
      message: "Aluno cadastrado com sucesso",
      data: aluno,
    });
  });

  buscarAluno = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      throw new AppError("ID inválido", 400);
    }

    const aluno = await alunoService.buscarAlunoPorId(parseInt(id));

    res.status(200).json({
      success: true,
      data: aluno,
    });
  });

  listarAlunos = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    if (limit < 1 || limit > 100) {
      throw new AppError("Limit deve ser entre 1 e 100", 400);
    }

    if (offset < 0) {
      throw new AppError("Offset deve ser maior ou igual a 0", 400);
    }

    const resultado = await alunoService.listarAlunos(limit, offset);

    res.status(200).json({
      success: true,
      data: resultado.alunos,
      pagination: {
        total: resultado.total,
        limit: resultado.limit,
        offset: resultado.offset,
        hasMore: resultado.offset + resultado.limit < resultado.total,
      },
    });
  });

  verificarUsuario = asyncHandler(async (req, res) => {
    const { usuario } = req.params;

    if (!usuario || usuario.trim().length === 0) {
      throw new AppError("Usuário não fornecido", 400);
    }

    const existe = await alunoService.verificarUsuarioExiste(usuario);

    res.status(200).json({
      success: true,
      disponivel: !existe,
      message: existe ? "Usuário já está em uso" : "Usuário disponível",
    });
  });

  verificarEmail = asyncHandler(async (req, res) => {
    const { email } = req.params;

    if (!email || email.trim().length === 0) {
      throw new AppError("Email não fornecido", 400);
    }

    const existe = await alunoService.verificarEmailExiste(email);

    res.status(200).json({
      success: true,
      disponivel: !existe,
      message: existe ? "Email já está em uso" : "Email disponível",
    });
  });

  atualizarAluno = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw new AppError("ID inválido", 400);
    }

    const { id_aluno } = req.usuario_autenticado;
    const validation = validateAlunoUpdateData(req.body);

    if (!validation.isValid) {
      throw new AppError("Dados inválidos", 400, validation.errors);
    }

    const alunoAtualizado = await alunoService.atualizarAluno(
      parseInt(id),
      id_aluno,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Aluno atualizado com sucesso",
      data: alunoAtualizado,
    });
  });

  deletarAluno = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw new AppError("ID inválido", 400);
    }

    const { id_aluno } = req.usuario_autenticado;
    await alunoService.deletarAluno(parseInt(id), id_aluno);

    res.status(200).json({
      success: true,
      message: "Conta deletada com sucesso",
    });
  });
}

export default new AlunoController();
