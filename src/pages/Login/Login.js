import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/IteraDiscService/IteraDiscServiceAuth";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const dados = await AuthService.loginAsync(email, senha);
      AuthService.salvarSessao(dados);

      if (dados.perfil === "Admin") {
        navigate("/produtos");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setErro("E-mail ou senha inválidos.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.painelEsquerdo}>
        <div className={styles.vinyl}>
          <div className={styles.vinylCentro} />
        </div>
        <div className={styles.taglineContainer}>
          <span className="secao-label">Est. 2025</span>
          <h1 className={styles.tagline}>
            A sua loja de<br />discos favorita.
          </h1>
          <p className={styles.taglineSub}>
            Música que atravessa gerações,<br />em um só lugar.
          </p>
        </div>
      </div>

      <div className={styles.painelDireito}>
        <div className={styles.formContainer}>
          <div className={styles.logoArea}>
            <img
              src={require("../../assets/IteraDiscLogo.png")}
              alt="IteraDisc"
              className={styles.logo}
            />
          </div>

          <span className="secao-label">Acesso à plataforma</span>
          <h2 className={styles.titulo}>Entrar na conta</h2>
          <hr className="divisor-retro" />

          <form onSubmit={handleLogin}>
            <div className="form-grupo">
              <label className="label-retro">E-mail</label>
              <input
                className="input-retro"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-grupo">
              <label className="label-retro">Senha</label>
              <input
                className="input-retro"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && <div className="alerta-erro">{erro}</div>}

            <button
              type="submit"
              className="btn-retro btn-retro-primario w-100"
              disabled={carregando}
              style={{ justifyContent: "center", marginTop: "0.5rem" }}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className={styles.cadastroTexto}>
            Não tem conta?{" "}
            <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;