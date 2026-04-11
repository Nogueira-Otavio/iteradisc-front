import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import styles from "./Layout.module.css";

function Layout({ children, titulo }) {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar titulo={titulo} />
        <main className={styles.conteudo}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;