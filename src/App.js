import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Páginas públicas
import Login from "./pages/Login/Login";
import NovoUsuario from "./pages/Usuario/NovoUsuario/NovoUsuario";

// Páginas do cliente
import Home from "./pages/Home/Home";
import Perfil from "./pages/Usuario/EditarUsuario/EditarUsuario";
import AlterarSenha from "./pages/Usuario/AlterarSenha/AlterarSenha";
import Carrinho from "./pages/Carrinho/Carrinho";
import Historico from "./pages/Venda/Historico/Historico";

// Páginas do admin
import Produtos from "./pages/Produto/Produto";
import NovoProduto from "./pages/Produto/NovoProduto/NovoProduto";
import EditarProduto from "./pages/Produto/EditarProduto/EditarProduto";
import ProdutosInativos from "./pages/Produto/ProdutosInativos/ProdutosInativos";
import Usuarios from "./pages/Usuario/Usuarios/Usuarios";
import UsuariosInativos from "./pages/Usuario/UsuariosInativos/UsuariosInativos";
import AdminVendas from "./pages/Venda/Venda";

import RotaProtegida from "./components/RotaProtegida/RotaProtegida";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<NovoUsuario />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<RotaProtegida />}>
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/alterar-senha" element={<AlterarSenha />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/historico" element={<Historico />} />
        </Route>

        <Route element={<RotaProtegida apenasAdmin />}>
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/novo" element={<NovoProduto />} />
          <Route path="/produtos/editar/:id" element={<EditarProduto />} />
          <Route path="/produtos/inativos" element={<ProdutosInativos />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuarios/inativos" element={<UsuariosInativos />} />
          <Route path="/vendas" element={<AdminVendas />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;