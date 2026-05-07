import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import VendaService from "../../services/IteraDiscService/IteraDiscServiceVenda";
import styles from "./Venda.module.css";

function Venda() {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [usandoRelatorio, setUsandoRelatorio] = useState(false);

  useEffect(() => {
    carregarVendas();
  }, []);

  async function carregarVendas() {
    setCarregando(true);
    try {
      const dados = await VendaService.listarAsync();
      setVendas(dados);
      setUsandoRelatorio(false);
    } catch (err) {
      console.error("Erro ao carregar vendas:", err);
    } finally {
      setCarregando(false);
    }
  }

  async function handleFiltrar() {
    if (!dataInicio || !dataFim) {
      alert("Preencha as duas datas para filtrar.");
      return;
    }
    setCarregando(true);
    try {
      const inicio = `${dataInicio}T00:00:00`;
      const fim = `${dataFim}T23:59:59`;
      const dados = await VendaService.relatorioAsync(inicio, fim);
      setVendas(dados);
      setUsandoRelatorio(true);
    } catch (err) {
      console.error("Erro no relatório:", err.response?.data || err.message);
      alert("Erro ao filtrar: " + (err.response?.data || err.message));
    } finally {
      setCarregando(false);
    }
  }

  async function handleLimpar() {
    setDataInicio("");
    setDataFim("");
    await carregarVendas();
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

  const totalGeral = vendas.reduce(
    (acc, v) => acc + (v.valorTotalVenda || 0),
    0
  );

  return (
    <Layout titulo="Vendas">
      <div className={styles.cabecalho}>
        <div className={styles.cabecalhoTitulo}>
          <span className="secao-label">Relatório</span>
          <h2>Histórico de vendas</h2>
          <p>
            {vendas.length} venda{vendas.length !== 1 ? "s" : ""} encontrada
            {vendas.length !== 1 ? "s" : ""}
            {usandoRelatorio && (
              <span className={styles.badgeDapper}>via Dapper</span>
            )}
          </p>
        </div>
      </div>

      <div className={styles.resumo}>
        <div className={styles.resumoCard}>
          <span className={styles.resumoLabel}>Total de vendas</span>
          <span className={styles.resumoValor}>{vendas.length}</span>
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
            {vendas.length > 0
              ? (totalGeral / vendas.length).toFixed(2).replace(".", ",")
              : "0,00"}
          </span>
        </div>
      </div>

      <div className={styles.filtros}>
        <div className={styles.filtroGrupo}>
          <label className="label-retro">Data início</label>
          <input
            className="input-retro"
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            style={{ width: "180px" }}
          />
        </div>
        <div className={styles.filtroGrupo}>
          <label className="label-retro">Data fim</label>
          <input
            className="input-retro"
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            style={{ width: "180px" }}
          />
        </div>
        <button
          className="btn-retro btn-retro-primario"
          onClick={handleFiltrar}
        >
          Filtrar
        </button>
        <button
          className="btn-retro btn-retro-secundario"
          onClick={handleLimpar}
        >
          Limpar
        </button>
      </div>

      <div className={styles.tabelaContainer}>
        {carregando ? (
          <div className="centralizador">
            <div className="spinner-retro" />
          </div>
        ) : vendas.length === 0 ? (
          <p className={styles.vazio}>Nenhuma venda encontrada.</p>
        ) : (
          <table className="tabela-retro">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Itens</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((v) => (
                <tr key={v.vendaId}>
                  <td
                    className="texto-secundario"
                    style={{ fontFamily: "var(--fonte-mono)", fontSize: "0.8rem" }}
                  >
                    #{v.vendaId}
                  </td>
                  <td
                    className="texto-creme"
                    style={{ fontFamily: "var(--fonte-titulo)" }}
                  >
                    {v.nomeCliente || v.usuario?.nome || "—"}
                  </td>
                  <td>
                    <span className={styles.data}>
                      {formatarData(v.dataVenda)}
                    </span>
                  </td>
                  <td>
                    <span className={styles.itens}>
                      {usandoRelatorio
                        ? `${v.totalItens} item${v.totalItens !== 1 ? "s" : ""}`
                        : `${v.itens?.length || 0} item${(v.itens?.length || 0) !== 1 ? "s" : ""}`}
                    </span>
                  </td>
                  <td>
                    <span className={styles.total}>
                      R$ {v.valorTotalVenda.toFixed(2).replace(".", ",")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default Venda;