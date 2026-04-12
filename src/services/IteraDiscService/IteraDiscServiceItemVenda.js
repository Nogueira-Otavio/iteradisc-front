import { HTTPClient } from "../client";

const ItemVendaService = {
  async criarAsync(produtoId, quantidade) {
    const response = await HTTPClient.post("/ItemVenda/Criar", {
      produtoId: produtoId,
      quantidade: quantidade,
      valorItemVenda: 0,
    });
    return response.data;
  },
};

export default ItemVendaService;