import express from "express";
import corsConfig from "./middlewares/corsConfig.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./utils/errorHandler.js";
import {pool} from "./config/database.js"
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

app.use(corsConfig);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(rateLimiter);

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer =  () => {
  app.listen(PORT, () => {
    console.log("=".repeat(50));
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`API disponível em: http://localhost:${PORT}`);
    console.log("=".repeat(50));
  });
};

startServer();
