import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UsuarioService from "../../../services/IteraDiscService/IteraDiscServiceUsuario";
import styles from "./NovoUsuario.module.css";

function NovoUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCadastro(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (form.senha !== form.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (form.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      await UsuarioService.criarAsync({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        perfil: "Cliente",
      });

      setSucesso("Conta criada com sucesso! Redirecionando...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const mensagem =
        err.response?.data ||
        err.response?.data?.message ||
        "Erro ao criar conta. Tente novamente.";
      setErro(typeof mensagem === "string" ? mensagem : "Erro ao criar conta.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <img
            src={require("../../../assets/IteraDiscLogo.png")}
            alt="IteraDisc"
            className={styles.logo}
          />
        </div>

        <span className="secao-label">Nova conta</span>
        <h2 className={styles.titulo}>Criar cadastro</h2>
        <hr className="divisor-retro" />

        <form onSubmit={handleCadastro}>
          <div className="form-grupo">
            <label className="label-retro">Nome completo</label>
            <input
              className="input-retro"
              type="text"
              name="nome"
              placeholder="Seu nome"
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
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grupo">
            <label className="label-retro">Senha</label>
            <input
              className="input-retro"
              type="password"
              name="senha"
              placeholder="Mínimo 6 caracteres"
              value={form.senha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grupo">
            <label className="label-retro">Confirmar senha</label>
            <input
              className="input-retro"
              type="password"
              name="confirmarSenha"
              placeholder="Repita a senha"
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
              className="btn-retro btn-retro-primario w-100"
              disabled={carregando}
              style={{ justifyContent: "center" }}
            >
              {carregando ? "Criando conta..." : "Criar conta"}
            </button>

            <button
              type="button"
              className="btn-retro btn-retro-secundario w-100"
              onClick={() => navigate("/login")}
              style={{ justifyContent: "center" }}
            >
              Voltar ao login
            </button>
          </div>
        </form>

        <p className={styles.loginTexto}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

export default NovoUsuario;