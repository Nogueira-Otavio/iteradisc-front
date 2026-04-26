import { HTTPClient } from "../client";

const VendaService = {
  async criarAsync(venda) {
    const response = await HTTPClient.post("/Venda/Criar", venda);
    return response.data;
  },

  async obterAsync(vendaId) {
    const response = await HTTPClient.get(`/Venda/Obter/${vendaId}`);
    return response.data;
  },

  async listarAsync() {
    const response = await HTTPClient.get("/Venda/Listar");
    return response.data;
  },

  async historicoClienteAsync(usuarioId) {
    const response = await HTTPClient.get(
      `/Venda/HistoricoCliente?usuarioId=${usuarioId}`,
    );
    return response.data;
  },

  async relatorioAsync(dataInicio, dataFim) {
    const response = await HTTPClient.get(
      `/Venda/Relatorio?dataInicio=${dataInicio}&dataFim=${dataFim}`,
    );
    return response.data;
  },

  async historicoCompletoAsync() {
    const response = await HTTPClient.get("/Venda/HistoricoCompleto");
    return response.data;
  },
};

export default VendaService;
