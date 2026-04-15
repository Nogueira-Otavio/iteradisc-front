# 🎵 IteraDisc — Front-end

Interface web da loja de discos de vinil **IteraDisc**, desenvolvida em React com tema retrô/vintage como Trabalho de Conclusão de Curso.

> Back-end disponível em: [IteraDisc API](https://github.com/seu-usuario/iteradisc-back)

---

## ✨ Funcionalidades

### Área do Cliente
- Cadastro com validação de e-mail duplicado
- Login com redirecionamento automático por perfil
- Catálogo de discos com carrinho persistente
- Finalização de compra com atualização de estoque
- Histórico de pedidos expansível por compra
- Edição de perfil e troca de senha segura
- ChatBot com IA generativa especializado em música

### Área Administrativa
- CRUD completo de produtos com ativação/desativação
- Gerenciamento de usuários com controle de perfis (Admin/Cliente)
- Relatório de vendas com filtro por período
- Cards de resumo: total de vendas, receita e ticket médio
- Proteção de rotas por role — clientes não acessam área admin

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| React | Framework front-end |
| React Router DOM | Roteamento e rotas protegidas |
| Axios | Requisições HTTP com interceptor JWT |
| Bootstrap / React Bootstrap | Componentes de UI base |
| React Markdown | Renderização de respostas do ChatBot |
| CSS Modules | Estilização isolada por componente |

---

## 📁 Estrutura do projeto

```
src/
├── assets/               # Imagens e recursos estáticos
├── components/
│   ├── Layout/           # Container principal (Sidebar + Topbar)
│   ├── RotaProtegida/    # Proteção de rotas por autenticação e role
│   ├── Sidebar/          # Navegação lateral
│   ├── SidebarItem/      # Item individual da sidebar
│   └── Topbar/           # Barra superior com título e usuário
├── pages/
│   ├── Carrinho/         # Carrinho de compras e finalização
│   ├── ChatBot/          # Assistente com IA
│   ├── Home/             # Catálogo de discos (cliente)
│   ├── Login/            # Tela de login
│   ├── Produto/          # CRUD de produtos (admin)
│   ├── Usuario/          # Perfil, senha e gerenciamento
│   └── Venda/            # Histórico de compras e relatórios
└── services/
    └── IteraDiscService/ # Serviços de comunicação com a API
```

---

## 🚀 Como executar

### Pré-requisitos
- Node.js 18+
- API do IteraDisc rodando localmente

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/iteradisc-front.git
cd iteradisc-front

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

### Configuração da API

Por padrão, o front conecta na API em `http://localhost:5279`. Para alterar, edite o arquivo `src/services/client.js`:

```js
export const HTTPClient = axios.create({
  baseURL: "http://localhost:SUA_PORTA",
  ...
});
```

---

## 🎨 Tema visual

O projeto utiliza um tema **retrô/vintage** inspirado em lojas de discos dos anos 70/80:

| Variável | Cor | Uso |
|---|---|---|
| `--fundo` | `#0F1923` | Fundo principal |
| `--laranja` | `#C8873A` | Cor de destaque |
| `--creme` | `#F0E6D3` | Texto principal |
| `--fonte-titulo` | Playfair Display | Títulos e headings |
| `--fonte-mono` | Space Mono | Labels e navegação |

---

## 🔐 Autenticação

O sistema usa **JWT Bearer Token** com dois perfis:

- **Admin** → acesso a produtos, usuários, vendas e todas as rotas
- **Cliente** → acesso ao catálogo, carrinho, histórico e perfil

O token é armazenado no `localStorage` e enviado automaticamente em todas as requisições via interceptor do Axios. Ao expirar (401), o usuário é redirecionado para o login.

---

## 🤖 ChatBot com IA

O ChatBot utiliza a **Groq API** com o modelo `groq/compound`, integrado ao back-end C#. O assistente é especializado em:

- Recomendações de discos e artistas
- Dicas de conservação de vinil
- Informações sobre equipamentos de áudio
- História da música e estilos musicais

Perguntas fora desses temas são recusadas educadamente pelo assistente.

---

## 📦 Dependências principais

```json
"dependencies": {
  "axios": "^1.x",
  "bootstrap": "^5.x",
  "react": "^18.x",
  "react-bootstrap": "^2.x",
  "react-markdown": "^9.x",
  "react-router-dom": "^6.x"
}
```

---

## 🗂️ Versionamento

O projeto usa **Git Flow simplificado** com branches por funcionalidade:

```
main                        ← código estável
└── feature/autenticacao    ← login, cadastro, rotas protegidas
└── feature/catalogo        ← listagem e carrinho
└── feature/admin           ← área administrativa
└── feature/ajustes-finais  ← correções e polimentos
```

### Padrão de commits

```
feat: nova funcionalidade
fix: correção de bug
style: mudança visual/CSS
chore: configuração e setup
refactor: reorganização de código
```

