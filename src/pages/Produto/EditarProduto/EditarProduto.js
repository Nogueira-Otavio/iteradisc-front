import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import ProdutoService from "../../../services/IteraDiscService/IteraDiscServiceProduto";
import styles from "./EditarProduto.module.css";

function EditarProduto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    emEstoque: "",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);

  useEffect(() => {
    async function carregarProduto() {
      try {
        const dados = await ProdutoService.obterAsync(id);
        setForm({
          nome: dados.nome,
          descricao: dados.descricao || "",
          preco: dados.preco,
          emEstoque: dados.emEstoque,
        });
      } catch (err) {
        setErro("Erro ao carregar produto.");
      } finally {
        setCarregandoDados(false);
      }
    }
    carregarProduto();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!form.nome || !form.preco || form.emEstoque === "") {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setCarregando(true);
    try {
      await ProdutoService.atualizarAsync({
        produtoId: parseInt(id),
        nome: form.nome,
        descricao: form.descricao,
        preco: parseFloat(form.preco),
        emEstoque: parseInt(form.emEstoque),
      });
      setSucesso("Produto atualizado! Redirecionando...");
      setTimeout(() => navigate("/produtos"), 2000);
    } catch (err) {
      setErro("Erro ao atualizar produto.");
    } finally {
      setCarregando(false);
    }
  }

  if (carregandoDados) {
    return (
      <Layout titulo="Editar Produto">
        <div className="centralizador">
          <div className="spinner-retro" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout titulo="Editar Produto">
      <div className={styles.container}>
        <div className={styles.cabecalho}>
          <span className="secao-label">Edição</span>
          <h2>Editar produto</h2>
          <p>Atualize as informações do disco</p>
        </div>

        <div className={styles.card}>
          <form onSubmit={handleSalvar}>
            <div className="form-grupo">
              <label className="label-retro">Nome *</label>
              <input
                className="input-retro"
                type="text"
                name="nome"
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
                {carregando ? "Salvando..." : "💾 Salvar alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default EditarProduto;