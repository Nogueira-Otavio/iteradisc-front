import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import ProdutoService from "../../services/IteraDiscService/IteraDiscServiceProduto";
import styles from "./Home.module.css";

function Home() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const dados = await ProdutoService.listarAsync(true);
        setProdutos(dados);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      } finally {
        setCarregando(false);
      }
    }
    carregarProdutos();

    const carrinhoSalvo = localStorage.getItem("carrinho");
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo));
    }
  }, []);

  function adicionarAoCarrinho(produto) {
    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho") || "[]");
    const itemExistente = carrinhoAtual.find(
      (i) => i.produtoId === produto.produtoId
    );

    let novoCarrinho;
    if (itemExistente) {
      novoCarrinho = carrinhoAtual.map((i) =>
        i.produtoId === produto.produtoId
          ? { ...i, quantidade: i.quantidade + 1 }
          : i
      );
    } else {
      novoCarrinho = [
        ...carrinhoAtual,
        {
          produtoId: produto.produtoId,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
        },
      ];
    }

    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    setCarrinho(novoCarrinho);
    alert(`"${produto.nome}" adicionado ao carrinho!`);
  }

  if (carregando) {
    return (
      <Layout titulo="Catálogo">
        <div className="centralizador">
          <div className="spinner-retro" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout titulo="Catálogo de Discos">
      <div className={styles.cabecalho}>
        <span className="secao-label">Disponíveis agora</span>
        <p className={styles.subtitulo}>
          {produtos.length} disco{produtos.length !== 1 ? "s" : ""} encontrado{produtos.length !== 1 ? "s" : ""}
        </p>
      </div>

      {produtos.length === 0 ? (
        <p className={styles.vazio}>Nenhum disco disponível no momento.</p>
      ) : (
        <div className={styles.grid}>
          {produtos.map((produto) => (
            <div key={produto.produtoId} className={styles.card}>
              <div className={styles.cardCapa}>
                <div className={styles.vinylMini}>
                  <div className={styles.vinylMiniCentro} />
                </div>
              </div>

              <div className={styles.cardInfo}>
                <h3 className={styles.cardNome}>{produto.nome}</h3>
                <p className={styles.cardDescricao}>{produto.descricao}</p>

                <div className={styles.cardRodape}>
                  <span className={styles.cardPreco}>
                    R$ {produto.preco.toFixed(2).replace(".", ",")}
                  </span>
                  <span className={styles.cardEstoque}>
                    {produto.emEstoque} un.
                  </span>
                </div>

                <button
                  className={`btn-retro btn-retro-primario ${styles.btnComprar}`}
                  onClick={() => adicionarAoCarrinho(produto)}
                  disabled={produto.emEstoque === 0}
                >
                  {produto.emEstoque === 0 ? "Esgotado" : "🛒 Adicionar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Home;