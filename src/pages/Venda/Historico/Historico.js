import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import VendaService from "../../../services/IteraDiscService/IteraDiscServiceVenda";
import AuthService from "../../../services/IteraDiscService/IteraDiscServiceAuth";
import styles from "./Historico.module.css";

function Historico() {
  const navigate = useNavigate();
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [abertas, setAbertas] = useState({});

  useEffect(() => {
    async function carregarHistorico() {
      try {
        const usuarioId = AuthService.obterUsuarioId();
        const dados = await VendaService.historicoClienteAsync(usuarioId);
        setVendas(dados);
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      } finally {
        setCarregando(false);
      }
    }
    carregarHistorico();
  }, []);

  function toggleVenda(vendaId) {
    setAbertas((prev) => ({ ...prev, [vendaId]: !prev[vendaId] }));
  }

  function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const totalGasto = vendas.reduce((acc, v) => acc + v.valorTotalVenda, 0);

  if (carregando) {
    return (
      <Layout titulo="Minhas Compras">
        <div className="centralizador">
          <div className="spinner-retro" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout titulo="Minhas Compras">
      <div className={styles.cabecalho}>
        <span className="secao-label">Histórico</span>
        <h2>Minhas compras</h2>
        <p>
          {vendas.length} pedido{vendas.length !== 1 ? "s" : ""} realizado
          {vendas.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className={styles.resumo}>
        <div className={styles.resumoCard}>
          <span className={styles.resumoLabel}>Total de pedidos</span>
          <span className={styles.resumoValor}>{vendas.length}</span>
        </div>
        <div className={styles.resumoCard}>
          <span className={styles.resumoLabel}>Total investido</span>
          <span className={styles.resumoValor}>
            R$ {totalGasto.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      {vendas.length === 0 ? (
        <div className={styles.vazio}>
          <span className={styles.vazioIcone}>📋</span>
          <p className={styles.vazioTexto}>Você ainda não fez nenhuma compra.</p>
          <button
            className="btn-retro btn-retro-primario"
            onClick={() => navigate("/home")}
          >
            🎵 Ver catálogo
          </button>
        </div>
      ) : (
        vendas.map((venda) => (
          <div key={venda.vendaId} className={styles.tabelaContainer}>
            <div
              className={styles.vendaHeader}
              onClick={() => toggleVenda(venda.vendaId)}
            >
              <div className={styles.vendaHeaderInfo}>
                <span className={styles.vendaId}>#{venda.vendaId}</span>
                <span className={styles.vendaData}>
                  {formatarData(venda.dataVenda)}
                </span>
                <span className="badge-retro badge-cliente">
                  {venda.itens?.length || 0} item
                  {(venda.itens?.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span className={styles.vendaTotal}>
                  R$ {venda.valorTotalVenda.toFixed(2).replace(".", ",")}
                </span>
                <span
                  className={`${styles.vendaSetinha} ${
                    abertas[venda.vendaId] ? styles.vendaSetinhaAberta : ""
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>

            {abertas[venda.vendaId] && (
              <div className={styles.itensContainer}>
                <table className="tabela-retro">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Valor unitário</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venda.itens?.map((item) => (
                      <tr key={item.itemVendaId}>
                        <td
                          className="texto-creme"
                          style={{ fontFamily: "var(--fonte-titulo)" }}
                        >
                          {item.produto?.nome || `Produto #${item.produtoId}`}
                        </td>
                        <td
                          style={{
                            fontFamily: "var(--fonte-mono)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {item.quantidade}x
                        </td>
                        <td
                          style={{
                            fontFamily: "var(--fonte-mono)",
                            color: "var(--cor-laranja)",
                          }}
                        >
                          R${" "}
                          {(item.valorItemVenda / item.quantidade)
                            .toFixed(2)
                            .replace(".", ",")}
                        </td>
                        <td
                          style={{
                            fontFamily: "var(--fonte-mono)",
                            color: "var(--cor-laranja)",
                            fontWeight: "700",
                          }}
                        >
                          R$ {item.valorItemVenda.toFixed(2).replace(".", ",")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      )}
    </Layout>
  );
}

export default Historico;