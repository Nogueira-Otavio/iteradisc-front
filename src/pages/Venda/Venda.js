import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import VendaService from "../../services/IteraDiscService/IteraDiscServiceVenda";
import styles from "./Venda.module.css";

function Venda() {
  const [vendas, setVendas] = useState([]);
  const [vendasFiltradas, setVendasFiltradas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [buscaCliente, setBuscaCliente] = useState("");
  const [abertas, setAbertas] = useState({});

  useEffect(() => {
    carregarVendas();
  }, []);

  async function carregarVendas() {
    try {
      const dados = await VendaService.listarAsync();
      setVendas(dados);
      setVendasFiltradas(dados);
    } catch (err) {
      console.error("Erro ao carregar vendas:", err);
    } finally {
      setCarregando(false);
    }
  }

  function handleFiltrar() {
    let filtradas = [...vendas];

    if (buscaCliente.trim()) {
      filtradas = filtradas.filter((v) =>
        (v.nomeCliente || "").toLowerCase().includes(buscaCliente.toLowerCase())
      );
    }

    if (dataInicio) {
      filtradas = filtradas.filter(
        (v) => new Date(v.dataVenda) >= new Date(dataInicio)
      );
    }

    if (dataFim) {
      filtradas = filtradas.filter(
        (v) => new Date(v.dataVenda) <= new Date(dataFim + "T23:59:59")
      );
    }

    setVendasFiltradas(filtradas);
  }

  function handleLimpar() {
    setBuscaCliente("");
    setDataInicio("");
    setDataFim("");
    setVendasFiltradas(vendas);
  }

  function toggleVenda(vendaId) {
    setAbertas((prev) => ({ ...prev, [vendaId]: !prev[vendaId] }));
  }

  function formatarData(dataString) {
    return new Date(dataString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const totalGeral = vendasFiltradas.reduce(
    (acc, v) => acc + v.valorTotalVenda, 0
  );

  return (
    <Layout titulo="Vendas">
      <div className={styles.cabecalho}>
        <div className={styles.cabecalhoTitulo}>
          <span className="secao-label">Relatório</span>
          <h2>Histórico de vendas</h2>
          <p>
            {vendasFiltradas.length} venda
            {vendasFiltradas.length !== 1 ? "s" : ""} encontrada
            {vendasFiltradas.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className={styles.resumo}>
        <div className={styles.resumoCard}>
          <span className={styles.resumoLabel}>Total de vendas</span>
          <span className={styles.resumoValor}>{vendasFiltradas.length}</span>
        </div>
        <div className={styles.resumoCard}>
          <span className={styles.resumoLabel}>Receita total</span>
          <span className={styles.resumoValor}>
            R$ {totalGeral.toFixed(2).replace(".", ",")}
          </span>
        </div>
        <div className={styles.resumoCard}>
          <span className={styles.resumoLabel}>Ticket médio</span>
          <span className={styles.resumoValor}>
            R${" "}
            {vendasFiltradas.length > 0
              ? (totalGeral / vendasFiltradas.length).toFixed(2).replace(".", ",")
              : "0,00"}
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.filtros}>
        <div className={styles.filtroGrupo}>
          <label className="label-retro">Cliente</label>
          <input
            className="input-retro"
            type="text"
            placeholder="Buscar por nome..."
            value={buscaCliente}
            onChange={(e) => setBuscaCliente(e.target.value)}
            style={{ width: "180px" }}
          />
        </div>
        <div className={styles.filtroGrupo}>
          <label className="label-retro">Data início</label>
          <input
            className="input-retro"
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            style={{ width: "160px" }}
          />
        </div>
        <div className={styles.filtroGrupo}>
          <label className="label-retro">Data fim</label>
          <input
            className="input-retro"
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            style={{ width: "160px" }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignSelf: "flex-end" }}>
          <button className="btn-retro btn-retro-primario" onClick={handleFiltrar}>
            Filtrar
          </button>
          <button className="btn-retro btn-retro-secundario" onClick={handleLimpar}>
            Limpar
          </button>
        </div>
      </div>

      {/* Vendas expansíveis */}
      {carregando ? (
        <div className="centralizador">
          <div className="spinner-retro" />
        </div>
      ) : vendasFiltradas.length === 0 ? (
        <p className={styles.vazio}>Nenhuma venda encontrada.</p>
      ) : (
        vendasFiltradas.map((v) => (
          <div key={v.vendaId} className={styles.tabelaContainer}>
            <div
              className={styles.vendaHeader}
              onClick={() => toggleVenda(v.vendaId)}
            >
              <div className={styles.vendaHeaderInfo}>
                <span className={styles.vendaId}>#{v.vendaId}</span>
                <span className={styles.vendaCliente}>
                  {v.nomeCliente || "—"}
                </span>
                <span className={styles.vendaData}>
                  {formatarData(v.dataVenda)}
                </span>
                <span className="badge-retro badge-admin">
                  {v.itens?.length || 0} item
                  {(v.itens?.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span className={styles.vendaTotal}>
                  R$ {v.valorTotalVenda.toFixed(2).replace(".", ",")}
                </span>
                <span
                  className={`${styles.vendaSetinha} ${
                    abertas[v.vendaId] ? styles.vendaSetinhaAberta : ""
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>

            {abertas[v.vendaId] && (
              <div className={styles.itensContainer}>
                {v.itens && v.itens.length > 0 ? (
                  <table className="tabela-retro">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Valor unit.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {v.itens.map((item) => (
                        <tr key={item.itemVendaId}>
                          <td className="texto-creme" style={{ fontFamily: "var(--fonte-titulo)" }}>
                            {item.produto?.nome || `Produto #${item.produtoId}`}
                          </td>
                          <td style={{ fontFamily: "var(--fonte-mono)", fontSize: "0.85rem" }}>
                            {item.quantidade}x
                          </td>
                          <td style={{ fontFamily: "var(--fonte-mono)", color: "var(--cor-laranja)" }}>
                            R$ {(item.valorItemVenda / item.quantidade).toFixed(2).replace(".", ",")}
                          </td>
                          <td style={{ fontFamily: "var(--fonte-mono)", color: "var(--cor-laranja)", fontWeight: "700" }}>
                            R$ {item.valorItemVenda.toFixed(2).replace(".", ",")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: "var(--cor-texto-secundario)", fontStyle: "italic" }}>
                    Nenhum item registrado.
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </Layout>
  );
}

export default Venda;