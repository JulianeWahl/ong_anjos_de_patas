## ONG Anjos de Patas

Sistema web desenvolvido para uma ONG de proteção animal, com o objetivo de criar uma presença digital para a organização e facilitar o gerenciamento de informações relacionadas aos animais.

🚧 Projeto em desenvolvimento.

## 📌 Sobre o projeto

O ONG Anjos de Patas é um projeto de site institucional desenvolvido para uma organização de proteção animal.

A aplicação é construída com Node.js, Express e TypeScript, usando Prisma para comunicação com o banco de dados PostgreSQL. As páginas são renderizadas no servidor com EJS e estilizadas com Tailwind CSS.

🛠️ **Tecnologias:**
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- EJS
- Tailwind CSS

## 📁 Estrutura

```
ong_anjos_de_patas/
├── backend/
│   ├── prisma/          # schema e migrations do banco
│   └── src/             # código do servidor
├── frontend/
│   ├── src/input.css    # entrada do Tailwind
│   └── public/css/      # style.css gerado pelo Tailwind
├── package.json
└── prisma.config.ts
```

## ▶️ Como rodar

Crie um arquivo `.env` na raiz do projeto com:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/anjos_de_patas"
SESSION_SECRET="uma-string-secreta"
```

Depois, na raiz:

```bash
npm install
npx prisma migrate dev             # aplica as migrations no banco
npx tsx backend/src/criar_admin.ts # cria o usuário admin (edite email e senha antes)
npx tsx backend/src/server.ts      # inicia o servidor em http://localhost:3000
npm run css                        # gera o CSS do Tailwind e fica observando mudanças
```

## 👩‍💻 Autoras

- Juliane Wahl
- Sthefany Souza

Projeto desenvolvido para fins de estudo e prática de desenvolvimento web.
