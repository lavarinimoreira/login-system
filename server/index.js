const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const app = express();
app.use(express.json());
app.use(cors());

// Configurações do banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "s1gnUpestud0",
  database: "LoginSystem",
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Conectado ao banco de dados MySQL");
});

// Rota para criação de um usuário
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar se o usuário já existe
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          throw error;
        }

        if (results.length > 0) {
          return res
            .status(400)
            .json({ message: "Email já registrado em nosso sistema" });
        }

        // Criptografar a senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserir o novo usuário no banco de dados
        db.query(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          (error, result) => {
            if (error) {
              throw error;
            }
            res.status(201).json({ message: "Usuário cadastrado com sucesso" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
});

// Rota para login de usuário
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário existe com o email fornecido
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          throw error;
        }

        if (results.length === 0) {
          return res.status(401).json({ message: "Usuário não encontrado" });
        }

        const user = results[0];

        // Verificar a senha
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          // Senha correta, login bem-sucedido
          res.status(200).json({ message: "Login bem-sucedido", user });
        } else {
          // Senha incorreta
          res.status(401).json({ message: "Credenciais inválidas" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
