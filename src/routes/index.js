import { Router } from "express";
import alunoRoutes from "./alunoRoutes.js";
import authRoutes from "./authRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/alunos", alunoRoutes);

export default router;
