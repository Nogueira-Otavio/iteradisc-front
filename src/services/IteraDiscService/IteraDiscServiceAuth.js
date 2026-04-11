import { HTTPClient } from "../client";

const AuthService = {
  async loginAsync(email, senha) {
    const response = await HTTPClient.post("/Auth/Login", {
      Email: email,
      Senha: senha,
    });
    return response.data;
  },

  salvarSessao(dados) {
    localStorage.setItem("token", dados.token);
    localStorage.setItem("usuarioId", dados.usuarioId);
    localStorage.setItem("nome", dados.nome);
    localStorage.setItem("perfil", dados.perfil);
  },

  encerrarSessao() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("nome");
    localStorage.removeItem("perfil");
  },

  estaLogado() {
    return !!localStorage.getItem("token");
  },

  obterToken() {
    return localStorage.getItem("token");
  },

  obterPerfil() {
    return localStorage.getItem("perfil");
  },

  obterUsuarioId() {
    return parseInt(localStorage.getItem("usuarioId"));
  },

  obterNome() {
    return localStorage.getItem("nome");
  },
};

export default AuthService;