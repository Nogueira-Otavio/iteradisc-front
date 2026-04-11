import { HTTPClient } from "../client";

const UsuarioService = {
  async criarAsync(usuario) {
    const response = await HTTPClient.post("/Usuario/Criar", usuario);
    return response.data;
  },

  async obterAsync(usuarioId) {
    const response = await HTTPClient.get(`/Usuario/Obter/${usuarioId}`);
    return response.data;
  },

  async atualizarAsync(usuario) {
    const response = await HTTPClient.put("/Usuario/Atualizar", usuario);
    return response.data;
  },

  async alterarSenhaAsync(dados) {
    const response = await HTTPClient.put("/Usuario/AlterarSenha", dados);
    return response.data;
  },

  async listarAsync(ativos = true) {
    const response = await HTTPClient.get(`/Usuario/Listar?ativos=${ativos}`);
    return response.data;
  },

  async deletarAsync(usuarioId) {
    const response = await HTTPClient.delete(`/Usuario/Deletar/${usuarioId}`);
    return response.data;
  },

  async restaurarAsync(usuarioId) {
    const response = await HTTPClient.put(`/Usuario/Restaurar/${usuarioId}`);
    return response.data;
  },
};

export default UsuarioService;