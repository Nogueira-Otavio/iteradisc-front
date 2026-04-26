import { HTTPClient } from "../client";

const ProdutoService = {
  async obterAsync(produtoId) {
    const response = await HTTPClient.get(`/Produto/Obter/${produtoId}`);
    return response.data;
  },

  async listarAsync(ativos = true) {
    const response = await HTTPClient.get(`/Produto/Listar?ativos=${ativos}`);
    return response.data;
  },

  async criarAsync(produto) {
    const response = await HTTPClient.post("/Produto/Criar", produto);
    return response.data;
  },

  async atualizarAsync(produto) {
    const response = await HTTPClient.put("/Produto/Atualizar", produto);
    return response.data;
  },

  async deletarAsync(produtoId) {
    const response = await HTTPClient.delete(`/Produto/Deletar/${produtoId}`);
    return response.data;
  },

  async restaurarAsync(produtoId) {
    const response = await HTTPClient.put(`/Produto/Restaurar/${produtoId}`);
    return response.data;
  },

  async estoqueBaixoAsync(limite = 5) {
    const response = await HTTPClient.get(
      `/Produto/EstoqueBaixo?limite=${limite}`,
    );
    return response.data;
  },
};

export default ProdutoService;
