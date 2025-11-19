import { Router } from "express";
import alunoController from "../controllers/alunoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", alunoController.criarAluno);
router.get("/", alunoController.listarAlunos);
router.get("/verificar/usuario/:usuario", alunoController.verificarUsuario);
router.get("/verificar/email/:email", alunoController.verificarEmail);
router.get("/:id", alunoController.buscarAluno);
router.put("/:id", authMiddleware, alunoController.atualizarAluno);
router.delete("/:id", authMiddleware, alunoController.deletarAluno);

export default router;
