import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import ProdutoService from "../../../services/IteraDiscService/IteraDiscServiceProduto";
import styles from "./NovoProduto.module.css";

function NovoProduto() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    emEstoque: "",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!form.nome || !form.preco || !form.emEstoque) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (parseFloat(form.preco) <= 0) {
      setErro("O preço deve ser maior que zero.");
      return;
    }

    if (parseInt(form.emEstoque) < 0) {
      setErro("O estoque não pode ser negativo.");
      return;
    }

    setCarregando(true);
    try {
      await ProdutoService.criarAsync({
        nome: form.nome,
        descricao: form.descricao,
        preco: parseFloat(form.preco),
        emEstoque: parseInt(form.emEstoque),
      });
      setSucesso("Produto criado com sucesso! Redirecionando...");
      setTimeout(() => navigate("/produtos"), 2000);
    } catch (err) {
      setErro("Erro ao criar produto. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Layout titulo="Novo Produto">
      <div className={styles.container}>
        <div className={styles.cabecalho}>
          <span className="secao-label">Cadastro</span>
          <h2>Novo produto</h2>
          <p>Preencha as informações do disco</p>
        </div>

        <div className={styles.card}>
          <form onSubmit={handleSalvar}>
            <div className="form-grupo">
              <label className="label-retro">Nome *</label>
              <input
                className="input-retro"
                type="text"
                name="nome"
                placeholder="Ex: Dark Side of the Moon"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grupo">
              <label className="label-retro">Descrição</label>
              <input
                className="input-retro"
                type="text"
                name="descricao"
                placeholder="Ex: Pink Floyd, 1973"
                value={form.descricao}
                onChange={handleChange}
              />
            </div>

            <div className={styles.grid2}>
              <div className="form-grupo">
                <label className="label-retro">Preço (R$) *</label>
                <input
                  className="input-retro"
                  type="number"
                  name="preco"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  value={form.preco}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-grupo">
                <label className="label-retro">Estoque *</label>
                <input
                  className="input-retro"
                  type="number"
                  name="emEstoque"
                  placeholder="0"
                  min="0"
                  value={form.emEstoque}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {erro && <div className="alerta-erro">{erro}</div>}
            {sucesso && <div className="alerta-sucesso">{sucesso}</div>}

            <div className={styles.acoes}>
              <button
                type="button"
                className="btn-retro btn-retro-secundario"
                onClick={() => navigate("/produtos")}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-retro btn-retro-primario"
                disabled={carregando}
              >
                {carregando ? "Salvando..." : "💿 Salvar produto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default NovoProduto;