import React, { useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = React.useState({
    username: "",
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/signup", {
        username,
        email,
        password,
      });

      // Limpar os campos após o envio dos dados
      setUsername("");
      setEmail("");
      setPassword("");

      alert("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar o usuário:", error);
      alert(
        "Erro ao cadastrar o usuário. Verifique o console para mais detalhes."
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Adicionando console.log para verificar os envios de dados
      // console.log("Enviando dados de login:", {
      //   email: loginEmail,
      //   password: loginPassword,
      // });

      const response = await axios.post("http://localhost:3000/login", {
        email: loginEmail,
        password: loginPassword,
      });

      // Limpar os campos após o envio dos dados
      setLoginEmail("");
      setLoginPassword("");

      // Exibir a resposta do backend no console
      console.log("Resposta do servidor:", response.data);
      setUser({
        username: response.data.user.username,
        email: response.data.user.email,
      });

      alert("Login bem-sucedido!");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login. Verifique o console para mais detalhes.");
    }
  };

  return (
    <div className="container">
      {user.username.length > 0 ? (
        <>
          <span>logging on!</span>
          <h1>{user.username}</h1>
          <h2>{user.email}</h2>
        </>
      ) : undefined}
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit} className="cadastro">
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Cadastrar</button>
      </form>

      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login">
        <div>
          <label htmlFor="login-email">Email:</label>
          <input
            id="login-email"
            type="text"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="login-password">Password:</label>
          <input
            id="login-password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default App;
