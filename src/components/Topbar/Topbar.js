import React from "react";
import AuthService from "../../services/IteraDiscService/IteraDiscServiceAuth";
import styles from "./Topbar.module.css";

function Topbar({ titulo }) {
  const nome = AuthService.obterNome();

  return (
    <div className={styles.topbar}>
      <h1 className={styles.titulo}>{titulo}</h1>
      <div className={styles.direita}>
        <span className={styles.saudacao}>
          Olá, <span className={styles.destaque}>{nome}</span>
        </span>
      </div>
    </div>
  );
}

export default Topbar;