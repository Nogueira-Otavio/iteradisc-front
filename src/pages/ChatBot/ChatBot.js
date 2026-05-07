import React, { useState, useRef, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import GroqService from "../../services/IteraDiscService/IteraDiscServiceGroqService";
import AuthService from "../../services/IteraDiscService/IteraDiscServiceAuth";
import ReactMarkdown from "react-markdown";
import styles from "./ChatBot.module.css";
import remarkGfm from "remark-gfm";

const SUGESTOES = [
  "Me recomende um disco de jazz",
  "Qual o melhor vinil para iniciantes?",
  "Me fale sobre Pink Floyd",
  "Como conservar discos de vinil?",
];

function ChatBot() {
  const [mensagens, setMensagens] = useState([]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const chatBoxRef = useRef(null);
  const nome = AuthService.obterNome();
  const iniciais = nome ? nome.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [mensagens, carregando]);

  async function enviarMensagem(texto) {
    const mensagem = texto || input.trim();
    if (!mensagem || carregando) return;

    setInput("");
    setMensagens((prev) => [...prev, { tipo: "usuario", texto: mensagem }]);
    setCarregando(true);

    try {
      const resposta = await GroqService.enviarMensagemAsync(mensagem);
      console.log("Tipo:", typeof resposta);
      console.log("Valor:", resposta);
      const textoResposta =
        typeof resposta === "string"
          ? resposta
          : resposta?.message || resposta?.resposta || JSON.stringify(resposta);

      setMensagens((prev) => [...prev, { tipo: "bot", texto: textoResposta }]);
    } catch (err) {
      setMensagens((prev) => [
        ...prev,
        {
          tipo: "bot",
          texto:
            "Estou com dificuldades técnicas no momento. Tente novamente em instantes! 🎵",
        },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  }

  return (
    <Layout titulo="ChatBot">
      <div className={styles.container}>
        <div className={styles.cabecalho}>
          <span className="secao-label">Assistente com IA</span>
          <h2>ChatBot IteraDisc</h2>
          <p>Especialista em discos, vinil e música — pergunte à vontade</p>
        </div>

        <div className={styles.chatBox} ref={chatBoxRef}>
          {mensagens.length === 0 && !carregando ? (
            <div className={styles.mensagemVazia}>
              <span className={styles.mensagemVaziaIcone}>🎵</span>
              <p className={styles.mensagemVaziaTexto}>
                Olá, {nome}! Sou o assistente virtual da IteraDisc.
                <br />
                Posso te ajudar com recomendações, dúvidas sobre discos e muito
                mais.
              </p>
              <div className={styles.sugestoes}>
                {SUGESTOES.map((s) => (
                  <button
                    key={s}
                    className={styles.sugestao}
                    onClick={() => enviarMensagem(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {mensagens.map((msg, i) => (
                <div
                  key={i}
                  className={`${styles.bolha} ${
                    msg.tipo === "usuario"
                      ? styles.bolhaUsuario
                      : styles.bolhaBot
                  }`}
                >
                  <div
                    className={`${styles.avatar} ${
                      msg.tipo === "usuario"
                        ? styles.avatarUsuario
                        : styles.avatarBot
                    }`}
                  >
                    {msg.tipo === "usuario" ? iniciais : "🎵"}
                  </div>
                  <div
                    className={`${styles.textoBolha} textoBolha ${
                      msg.tipo === "usuario" ? styles.textoBolhaUsuario : ""
                    }`}
                  >
                    {msg.tipo === "bot" ? (
                      <ReactMarkdown>{msg.texto}</ReactMarkdown>
                    ) : (
                      msg.texto
                    )}
                  </div>
                </div>
              ))}

              {carregando && (
                <div className={`${styles.bolha} ${styles.bolhaBot}`}>
                  <div className={`${styles.avatar} ${styles.avatarBot}`}>
                    🎵
                  </div>
                  <div className={styles.textoBolha}>
                    <div className={styles.digitando}>
                      <span className={styles.ponto} />
                      <span className={styles.ponto} />
                      <span className={styles.ponto} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.inputArea}>
          <input
            className={`input-retro ${styles.inputMensagem}`}
            type="text"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={carregando}
          />
          <button
            className={`btn-retro btn-retro-primario ${styles.btnEnviar}`}
            onClick={() => enviarMensagem()}
            disabled={carregando || !input.trim()}
          >
            Enviar
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default ChatBot;
