import { HTTPClient } from "../client";

const GroqService = {
  async enviarMensagemAsync(mensagem) {
    const response = await HTTPClient.post("/GroqService/Enviar", {
      mensagem: mensagem,
    });
    return response.data;
  },
};

export default GroqService;