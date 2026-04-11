import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./SidebarItem.module.css";

function SidebarItem({ to, icone, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? `${styles.item} ${styles.ativo}` : styles.item
      }
    >
      <span className={styles.icone}>{icone}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default SidebarItem;