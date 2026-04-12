import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import ProdutoService from "../../../services/IteraDiscService/IteraDiscServiceProduto";
import styles from "./ProdutosInativos.module.css";

function ProdutosInativos() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const dados = await ProdutoService.listarAsync(false);
      setProdutos(dados);
    } catch (err) {
      console.error("Erro ao carregar produtos inativos:", err);
    } finally {
      setCarregando(false);
    }
  }

  async function handleRestaurar(id, nome) {
    if (!window.confirm(`Reativar o produto "${nome}"?`)) return;
    try {
      await ProdutoService.restaurarAsync(id);
      await carregarProdutos();
    } catch (err) {
      alert("Erro ao reativar produto.");
    }
  }

  return (
    <Layout titulo="Produtos Inativos">
      <div className={styles.cabecalho}>
        <div className={styles.cabecalhoTitulo}>
          <span className="secao-label">Gerenciamento</span>
          <h2>Produtos inativos</h2>
          <p>{produtos.length} produto{produtos.length !== 1 ? "s" : ""} desativado{produtos.length !== 1 ? "s" : ""}</p>
        </div>

        <button
          className="btn-retro btn-retro-secundario"
          onClick={() => navigate("/produtos")}
        >
          ← Voltar aos ativos
        </button>
      </div>

      <div className={styles.tabelaContainer}>
        {carregando ? (
          <div className="centralizador">
            <div className="spinner-retro" />
          </div>
        ) : produtos.length === 0 ? (
          <p className={styles.vazio}>Nenhum produto inativo.</p>
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
                  <td className="texto-creme" style={{ fontFamily: "var(--fonte-titulo)", opacity: 0.6 }}>
                    {p.nome}
                  </td>
                  <td>{p.descricao}</td>
                  <td>
                    <span className={styles.preco}>
                      R$ {p.preco.toFixed(2).replace(".", ",")}
                    </span>
                  </td>
                  <td style={{ fontFamily: "var(--fonte-mono)", fontSize: "0.85rem" }}>
                    {p.emEstoque} un.
                  </td>
                  <td>
                    <button
                      className={styles.btnIcone}
                      onClick={() => handleRestaurar(p.produtoId, p.nome)}
                      title="Reativar"
                    >
                      ♻️ Reativar
                    </button>
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

export default ProdutosInativos;