import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/IteraDiscService/IteraDiscServiceAuth";
import SidebarItem from "../SidebarItem/SidebarItem";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const navigate = useNavigate();
  const perfil = AuthService.obterPerfil();
  const nome = AuthService.obterNome();

  function handleSair() {
    AuthService.encerrarSessao();
    navigate("/login");
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoArea}>
        <img
          src={require("../../assets/IteraDiscLogo.png")}
          alt="IteraDisc"
          className={styles.logo}
        />
      </div>

      <nav className={styles.nav}>

        <span className={styles.secaoTitulo}>Loja</span>
        <SidebarItem to="/home" icone="🎵" label="Catálogo" />
        <SidebarItem to="/carrinho" icone="🛒" label="Carrinho" />
        <SidebarItem to="/historico" icone="📋" label="Minhas Compras" />

        {/* Itens do Perfil */}
        <span className={styles.secaoTitulo}>Conta</span>
        <SidebarItem to="/perfil" icone="👤" label="Meu Perfil" />
        <SidebarItem to="/alterar-senha" icone="🔑" label="Alterar Senha" />

        {perfil === "Admin" && (
          <>
            <span className={styles.secaoTitulo}>Administração</span>
            <SidebarItem to="/produtos" icone="💿" label="Produtos" />
            <SidebarItem to="/usuarios" icone="👥" label="Usuários" />
            <SidebarItem to="/vendas" icone="📊" label="Vendas" />
          </>
        )}
      </nav>

      <div className={styles.rodape}>
        <div className={styles.usuarioInfo}>
          <span className={styles.usuarioNome}>{nome}</span>
          <span className={styles.usuarioPerfil}>{perfil}</span>
        </div>
        <button className={styles.btnSair} onClick={handleSair}>
          ⏻ Sair
        </button>
      </div>
    </div>
  );
}

export default Sidebar;