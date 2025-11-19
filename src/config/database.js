import mysql from "mysql2/promise";

const dbConfig = {
  host: "serverdbp2.mysql.database.azure.com",
  port: 3306,
  user: "useradmin",
  password: "admin@123",
  database: "db_guilherme_lopreti",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

export const pool = mysql.createPool(dbConfig);

