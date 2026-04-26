import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import ProdutoService from "../../services/IteraDiscService/IteraDiscServiceProduto";
import styles from "./Produto.module.css";

function Produto() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [estoqueBaixo, setEstoqueBaixo] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const [ativos, baixo] = await Promise.all([
        ProdutoService.listarAsync(true),
        ProdutoService.estoqueBaixoAsync(5),
      ]);
      setProdutos(ativos);
      setEstoqueBaixo(baixo);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setCarregando(false);
    }
  }

  async function handleDeletar(id, nome) {
    if (!window.confirm(`Desativar o produto "${nome}"?`)) return;
    try {
      await ProdutoService.deletarAsync(id);
      await carregarProdutos();
    } catch {
      alert("Erro ao desativar produto.");
    }
  }

  return (
    <Layout titulo="Produtos">
      <div className={styles.cabecalho}>
        <div className={styles.cabecalhoTitulo}>
          <span className="secao-label">Gerenciamento</span>
          <h2>Produtos ativos</h2>
          <p>{produtos.length} produto{produtos.length !== 1 ? "s" : ""} cadastrado{produtos.length !== 1 ? "s" : ""}</p>
        </div>
        <div className={styles.cabecalhoAcoes}>
          <button
            className="btn-retro btn-retro-secundario"
            onClick={() => navigate("/produtos/inativos")}
          >
            Ver inativos
          </button>
          <button
            className="btn-retro btn-retro-primario"
            onClick={() => navigate("/produtos/novo")}
          >
            + Novo produto
          </button>
        </div>
      </div>

      {estoqueBaixo.length > 0 && (
        <div className={styles.alertaEstoque}>
          <div className={styles.alertaTitulo}>
            <span className={styles.alertaIcone}>⚠️</span>
            <span>{estoqueBaixo.length} produto{estoqueBaixo.length !== 1 ? "s" : ""} com estoque baixo</span>
          </div>
          <div className={styles.alertaItens}>
            {estoqueBaixo.map((p) => (
              <div key={p.produtoId} className={styles.alertaItem}>
                <span className={styles.alertaNome}>{p.nome}</span>
                <span className={styles.alertaQtd}>{p.emEstoque} un.</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.tabelaContainer}>
        {carregando ? (
          <div className="centralizador">
            <div className="spinner-retro" />
          </div>
        ) : produtos.length === 0 ? (
          <p className={styles.vazio}>Nenhum produto cadastrado.</p>
        ) : (
          <table className="tabela-retro">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.produtoId}>
                  <td className="texto-secundario" style={{ fontFamily: "var(--fonte-mono)", fontSize: "0.8rem" }}>
                    #{p.produtoId}
                  </td>
                  <td className="texto-creme" style={{ fontFamily: "var(--fonte-titulo)" }}>
                    {p.nome}
                  </td>
                  <td>{p.descricao}</td>
                  <td>
                    <span className={styles.preco}>
                      R$ {p.preco.toFixed(2).replace(".", ",")}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.estoque} ${p.emEstoque <= 5 ? styles.estoquebaixo : ""}`}>
                      {p.emEstoque} un.
                    </span>
                  </td>
                  <td>
                    <div className={styles.acoes}>
                      <button
                        className={styles.btnIcone}
                        onClick={() => navigate(`/produtos/editar/${p.produtoId}`)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className={`${styles.btnIcone} ${styles.btnIconePerigo}`}
                        onClick={() => handleDeletar(p.produtoId, p.nome)}
                      >
                        🗑 Desativar
                      </button>
                    </div>
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

export default Produto;