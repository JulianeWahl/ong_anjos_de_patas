## ONG Anjos de Patas

Sistema web desenvolvido para uma ONG de proteção animal, com o objetivo de criar uma presença digital para a organização e facilitar o gerenciamento de informações relacionadas aos animais.

🚧 Projeto em desenvolvimento.

## 📌 Sobre o projeto

O ONG Anjos de Patas é um projeto de site institucional desenvolvido para uma organização de proteção animal.

O projeto é dividido em duas partes independentes, cada uma com seu próprio `package.json`:

- **backend/**: API em Node.js, Express e TypeScript, usando Prisma para comunicação com o banco de dados PostgreSQL.
- **frontend/**: interface em React com TypeScript, criada com Vite.

🛠️ **Tecnologias:**
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- React
- Vite

## 📁 Estrutura

```
ong_anjos_de_patas/
├── backend/
│   ├── prisma/          # schema e migrations do banco
│   ├── src/             # código da API
│   ├── prisma.config.ts
│   └── package.json
└── frontend/
    ├── src/             # código da interface React
    └── package.json
```

## ▶️ Como rodar

### Backend

Crie um arquivo `.env` dentro de `backend/` com:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/anjos_de_patas"
SESSION_SECRET="uma-string-secreta"
```

Depois, dentro de `backend/`:

```bash
npm install
npx prisma migrate dev     # aplica as migrations no banco
npx tsx src/criar_admin.ts # cria o usuário admin (edite email e senha antes)
npx tsx src/server.ts      # inicia a API em http://localhost:3000
```

### Frontend

Dentro de `frontend/`:

```bash
npm install
npm run dev                # inicia em http://localhost:5173
```

## 👩‍💻 Autoras

- Juliane Wahl
- Sthefany Souza

Projeto desenvolvido para fins de estudo e prática de desenvolvimento web.
