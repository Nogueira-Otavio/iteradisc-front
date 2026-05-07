import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import UsuarioService from "../../../services/IteraDiscService/IteraDiscServiceUsuario";
import AuthService from "../../../services/IteraDiscService/IteraDiscServiceAuth";
import styles from "./EditarUsuario.module.css";

function EditarUsuario() {
  const [form, setForm] = useState({ nome: "", email: "" });
  const [totalGasto, setTotalGasto] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);

  useEffect(() => {
  async function carregarDados() {
    try {
      const id = AuthService.obterUsuarioId();
      const dados = await UsuarioService.obterAsync(id);
      setForm({ nome: dados.nome, email: dados.email });

      try {
        const total = await UsuarioService.totalGastoAsync(id);
        setTotalGasto(total);
      } catch {
        setTotalGasto(0);
      }
    } catch (err) {
      setErro("Erro ao carregar dados do perfil.");
    } finally {
      setCarregandoDados(false);
    }
  }
  carregarDados();
}, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!form.nome || !form.email) {
      setErro("Preencha todos os campos.");
      return;
    }

    setCarregando(true);
    try {
      const id = AuthService.obterUsuarioId();
      await UsuarioService.atualizarAsync({
        usuarioId: id,
        nome: form.nome,
        email: form.email,
      });
      setSucesso("Perfil atualizado com sucesso!");
    } catch (err) {
      setErro("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  if (carregandoDados) {
    return (
      <Layout titulo="Meu Perfil">
        <div className="centralizador">
          <div className="spinner-retro" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout titulo="Meu Perfil">
      <div className={styles.container}>
        <div className={styles.cabecalho}>
          <span className="secao-label">Conta</span>
          <h2>Meu perfil</h2>
          <p>Atualize suas informações pessoais</p>
        </div>

        {totalGasto !== null && (
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Total investido em discos</span>
              <span className={styles.statValor}>
                R$ {Number(totalGasto).toFixed(2).replace(".", ",")}
              </span>
            </div>
            <div className={styles.statIcone}>🎵</div>
          </div>
        )}

        <div className={styles.card}>
          <form onSubmit={handleSalvar}>
            <div className="form-grupo">
              <label className="label-retro">Nome completo</label>
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
              <label className="label-retro">E-mail</label>
              <input
                className="input-retro"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {erro && <div className="alerta-erro">{erro}</div>}
            {sucesso && <div className="alerta-sucesso">{sucesso}</div>}

            <div className={styles.acoes}>
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

export default EditarUsuario;