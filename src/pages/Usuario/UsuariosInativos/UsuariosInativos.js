import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import UsuarioService from "../../../services/IteraDiscService/IteraDiscServiceUsuario";
import styles from "./UsuariosInativos.module.css";

function UsuariosInativos() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const dados = await UsuarioService.listarAsync(false);
      setUsuarios(dados);
    } catch (err) {
      console.error("Erro ao carregar usuários inativos:", err);
    } finally {
      setCarregando(false);
    }
  }

  async function handleRestaurar(id, nome) {
    if (!window.confirm(`Reativar o usuário "${nome}"?`)) return;
    try {
      await UsuarioService.restaurarAsync(id);
      await carregarUsuarios();
    } catch (err) {
      alert("Erro ao reativar usuário.");
    }
  }

  return (
    <Layout titulo="Usuários Inativos">
      <div className={styles.cabecalho}>
        <div className={styles.cabecalhoTitulo}>
          <span className="secao-label">Gerenciamento</span>
          <h2>Usuários inativos</h2>
          <p>{usuarios.length} usuário{usuarios.length !== 1 ? "s" : ""} desativado{usuarios.length !== 1 ? "s" : ""}</p>
        </div>

        <button
          className="btn-retro btn-retro-secundario"
          onClick={() => navigate("/usuarios")}
        >
          ← Voltar aos ativos
        </button>
      </div>

      <div className={styles.tabelaContainer}>
        {carregando ? (
          <div className="centralizador">
            <div className="spinner-retro" />
          </div>
        ) : usuarios.length === 0 ? (
          <p className={styles.vazio}>Nenhum usuário inativo.</p>
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
                  <td className="texto-creme" style={{ fontFamily: "var(--fonte-titulo)", opacity: 0.6 }}>
                    {u.nome}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge-retro badge-inativo`}>
                      {u.perfil}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.btnIcone}
                      onClick={() => handleRestaurar(u.usuarioId, u.nome)}
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

export default UsuariosInativos;