import React, { useState } from "react";
import Layout from "../../../components/Layout/Layout";
import UsuarioService from "../../../services/IteraDiscService/IteraDiscServiceUsuario";
import AuthService from "../../../services/IteraDiscService/IteraDiscServiceAuth";
import styles from "./AlterarSenha.module.css";

function AlterarSenha() {
  const [form, setForm] = useState({
    senhaAntiga: "",
    novaSenha: "",
    confirmarSenha: "",
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

    if (!form.senhaAntiga || !form.novaSenha || !form.confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (form.novaSenha !== form.confirmarSenha) {
      setErro("A nova senha e a confirmação não coincidem.");
      return;
    }

    if (form.novaSenha.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (form.novaSenha === form.senhaAntiga) {
      setErro("A nova senha deve ser diferente da senha atual.");
      return;
    }

    setCarregando(true);
    try {
      const id = AuthService.obterUsuarioId();
      await UsuarioService.alterarSenhaAsync({
        usuarioId: id,
        senhaAntiga: form.senhaAntiga,
        senha: form.novaSenha,
      });
      setSucesso("Senha alterada com sucesso!");
      setForm({ senhaAntiga: "", novaSenha: "", confirmarSenha: "" });
    } catch (err) {
      const mensagem = err.response?.data;
      setErro(
        typeof mensagem === "string" ? mensagem : "Erro ao alterar senha. Verifique a senha atual."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Layout titulo="Alterar Senha">
      <div className={styles.container}>
        <div className={styles.cabecalho}>
          <span className="secao-label">Segurança</span>
          <h2>Alterar senha</h2>
          <p>Mantenha sua conta protegida com uma senha forte</p>
        </div>

        <div className={styles.card}>
          <form onSubmit={handleSalvar}>
            <div className="form-grupo">
              <label className="label-retro">Senha atual</label>
              <input
                className="input-retro"
                type="password"
                name="senhaAntiga"
                placeholder="••••••••"
                value={form.senhaAntiga}
                onChange={handleChange}
                required
              />
            </div>

            <hr className="divisor-retro" />

            <div className="form-grupo">
              <label className="label-retro">Nova senha</label>
              <input
                className="input-retro"
                type="password"
                name="novaSenha"
                placeholder="Mínimo 6 caracteres"
                value={form.novaSenha}
                onChange={handleChange}
                required
              />
              <span className={styles.dica}>
                Use letras, números e símbolos para uma senha mais segura
              </span>
            </div>

            <div className="form-grupo">
              <label className="label-retro">Confirmar nova senha</label>
              <input
                className="input-retro"
                type="password"
                name="confirmarSenha"
                placeholder="Repita a nova senha"
                value={form.confirmarSenha}
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
                {carregando ? "Salvando..." : "🔑 Alterar senha"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AlterarSenha;