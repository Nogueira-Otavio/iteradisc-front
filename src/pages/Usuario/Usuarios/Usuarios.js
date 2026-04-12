import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import UsuarioService from "../../../services/IteraDiscService/IteraDiscServiceUsuario";
import AuthService from "../../../services/IteraDiscService/IteraDiscServiceAuth";
import styles from "./Usuarios.module.css";

function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const usuarioLogadoId = AuthService.obterUsuarioId();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const dados = await UsuarioService.listarAsync(true);
      setUsuarios(dados);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setCarregando(false);
    }
  }

  async function handleDeletar(id, nome) {
    if (id === usuarioLogadoId) {
      alert("Você não pode desativar sua própria conta.");
      return;
    }
    if (!window.confirm(`Desativar o usuário "${nome}"?`)) return;
    try {
      await UsuarioService.deletarAsync(id);
      await carregarUsuarios();
    } catch (err) {
      alert("Erro ao desativar usuário.");
    }
  }

  return (
    <Layout titulo="Usuários">
      <div className={styles.cabecalho}>
        <div className={styles.cabecalhoTitulo}>
          <span className="secao-label">Gerenciamento</span>
          <h2>Usuários ativos</h2>
          <p>{usuarios.length} usuário{usuarios.length !== 1 ? "s" : ""} cadastrado{usuarios.length !== 1 ? "s" : ""}</p>
        </div>

        <button
          className="btn-retro btn-retro-secundario"
          onClick={() => navigate("/usuarios/inativos")}
        >
          Ver inativos
        </button>
      </div>

      <div className={styles.tabelaContainer}>
        {carregando ? (
          <div className="centralizador">
            <div className="spinner-retro" />
          </div>
        ) : usuarios.length === 0 ? (
          <p className={styles.vazio}>Nenhum usuário encontrado.</p>
        ) : (
          <table className="tabela-retro">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.usuarioId}>
                  <td className="texto-secundario" style={{ fontFamily: "var(--fonte-mono)", fontSize: "0.8rem" }}>
                    #{u.usuarioId}
                  </td>
                  <td className="texto-creme" style={{ fontFamily: "var(--fonte-titulo)" }}>
                    {u.nome}
                    {u.usuarioId === usuarioLogadoId && (
                      <span className="badge-retro badge-admin" style={{ marginLeft: "0.5rem" }}>
                        Você
                      </span>
                    )}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge-retro ${u.perfil === "Admin" ? "badge-admin" : "badge-cliente"}`}>
                      {u.perfil}
                    </span>
                  </td>
                  <td>
                    <div className={styles.acoes}>
                      {u.usuarioId !== usuarioLogadoId && (
                        <button
                          className={`${styles.btnIcone} ${styles.btnIconePerigo}`}
                          onClick={() => handleDeletar(u.usuarioId, u.nome)}
                          title="Desativar"
                        >
                          🗑 Desativar
                        </button>
                      )}
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

export default Usuarios;