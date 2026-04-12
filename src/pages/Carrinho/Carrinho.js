import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import VendaService from "../../services/IteraDiscService/IteraDiscServiceVenda";
import AuthService from "../../services/IteraDiscService/IteraDiscServiceAuth";
import styles from "./Carrinho.module.css";

function Carrinho() {
  const navigate = useNavigate();
  const [carrinho, setCarrinho] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem("carrinho");
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo));
    }
  }, []);

  function salvarCarrinho(novoCarrinho) {
    setCarrinho(novoCarrinho);
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
  }

  function aumentarQuantidade(produtoId) {
    const novo = carrinho.map((i) =>
      i.produtoId === produtoId ? { ...i, quantidade: i.quantidade + 1 } : i
    );
    salvarCarrinho(novo);
  }

  function diminuirQuantidade(produtoId) {
    const novo = carrinho
      .map((i) =>
        i.produtoId === produtoId ? { ...i, quantidade: i.quantidade - 1 } : i
      )
      .filter((i) => i.quantidade > 0);
    salvarCarrinho(novo);
  }

  function removerItem(produtoId) {
    const novo = carrinho.filter((i) => i.produtoId !== produtoId);
    salvarCarrinho(novo);
  }

  function calcularTotal() {
    return carrinho.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  }

  async function handleFinalizar() {
    if (carrinho.length === 0) return;
    setErro("");
    setSucesso("");
    setCarregando(true);

    try {
      const usuarioId = AuthService.obterUsuarioId();
      const venda = {
        usuarioId,
        itensVenda: carrinho.map((i) => ({
          produtoId: i.produtoId,
          quantidade: i.quantidade,
        })),
      };

      await VendaService.criarAsync(venda);
      localStorage.removeItem("carrinho");
      setCarrinho([]);
      setSucesso("Compra realizada com sucesso! Obrigado pelo seu pedido. 🎵");
    } catch (err) {
      setErro("Erro ao finalizar compra. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  const total = calcularTotal();

  return (
    <Layout titulo="Carrinho">
      <div className={styles.cabecalho}>
        <span className="secao-label">Sua seleção</span>
        <h2>Carrinho de compras</h2>
        <p>{carrinho.length} item{carrinho.length !== 1 ? "s" : ""} adicionado{carrinho.length !== 1 ? "s" : ""}</p>
      </div>

      {sucesso && <div className="alerta-sucesso">{sucesso}</div>}
      {erro && <div className="alerta-erro">{erro}</div>}

      {carrinho.length === 0 && !sucesso ? (
        <div className={styles.vazio}>
          <span className={styles.vazioIcone}>🛒</span>
          <p className={styles.vazioTexto}>Seu carrinho está vazio.</p>
          <button
            className="btn-retro btn-retro-primario"
            onClick={() => navigate("/home")}
          >
            🎵 Ver catálogo
          </button>
        </div>
      ) : carrinho.length > 0 ? (
        <div className={styles.layout}>
          <div className={styles.tabelaContainer}>
            <table className="tabela-retro">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Preço unit.</th>
                  <th>Quantidade</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrinho.map((item) => (
                  <tr key={item.produtoId}>
                    <td
                      className="texto-creme"
                      style={{ fontFamily: "var(--fonte-titulo)" }}
                    >
                      {item.nome}
                    </td>
                    <td>
                      <span className={styles.preco}>
                        R$ {item.preco.toFixed(2).replace(".", ",")}
                      </span>
                    </td>
                    <td>
                      <div className={styles.controleQuantidade}>
                        <button
                          className={styles.btnQuantidade}
                          onClick={() => diminuirQuantidade(item.produtoId)}
                        >
                          −
                        </button>
                        <span className={styles.quantidade}>
                          {item.quantidade}
                        </span>
                        <button
                          className={styles.btnQuantidade}
                          onClick={() => aumentarQuantidade(item.produtoId)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={styles.preco}>
                        R${" "}
                        {(item.preco * item.quantidade)
                          .toFixed(2)
                          .replace(".", ",")}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.btnRemover}
                        onClick={() => removerItem(item.produtoId)}
                      >
                        🗑 Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.resumo}>
            <h3 className={styles.resumoTitulo}>Resumo do pedido</h3>
            <hr className="divisor-retro" />

            {carrinho.map((item) => (
              <div key={item.produtoId} className={styles.resumoLinha}>
                <span>
                  {item.nome} x{item.quantidade}
                </span>
                <span>
                  R$ {(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}

            <div className={styles.resumoTotal}>
              <span>Total</span>
              <span className={styles.resumoTotalValor}>
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <div className={styles.acoes}>
              <button
                className="btn-retro btn-retro-primario w-100"
                onClick={handleFinalizar}
                disabled={carregando}
                style={{ justifyContent: "center" }}
              >
                {carregando ? "Processando..." : "✅ Finalizar compra"}
              </button>
              <button
                className="btn-retro btn-retro-secundario w-100"
                onClick={() => navigate("/home")}
                style={{ justifyContent: "center" }}
              >
                ← Continuar comprando
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Layout>
  );
}

export default Carrinho;