# Contrato entre backend e frontend (páginas EJS)

Este arquivo diz **qual arquivo EJS cada rota renderiza** e **quais variáveis ele recebe**.
Se alguma coisa aqui mudar, quem mudou atualiza este arquivo no mesmo Pull Request.

## O que a Sthe precisa fazer

**1. Preparar o ambiente**
- [ ] Atualizar a `main` e criar a branch `feature/frontend` a partir dela
- [ ] `npm install -D tailwindcss @tailwindcss/cli`
- [ ] Criar `frontend/src/input.css` com `@import "tailwindcss";`
- [ ] Script no `package.json`: `"css": "tailwindcss -i frontend/src/input.css -o frontend/public/css/style.css --watch"`

**2. Partes comuns**
- [ ] `views/partials/header.ejs`: logo + menu (Início, Sobre, Animais, Como ajudar, Contato), sem link para admin
- [ ] `views/partials/footer.ejs`
- [ ] `public/img/`: logo e `sem-foto.png`

**3. Site público**
- [ ] `publico/inicio.ejs`, `publico/animais.ejs` (galeria + mensagem de lista vazia), `publico/sobre.ejs`,
      `publico/como-ajudar.ejs`, `publico/contato.ejs`, `publico/404.ejs`, (opcional) `publico/animal.ejs`

**4. Painel do admin**
- [ ] `admin/login.ejs`, `admin/painel.ejs`, `admin/form-animal.ejs` (cadastrar e editar, com `erros`)

**5. Acabamento**
- [ ] Testar no celular e abrir PR de `feature/frontend` para a `main`

Regras: mexer só em `frontend/` (e no `package.json` para o Tailwind). Precisa de um dado novo? Peça no doc/PR em vez de mudar o backend.
Em aberto (pedir para a ONG): textos do Sobre, chave Pix, contatos, redes sociais e logo.

## Onde ficam os arquivos

```
frontend/
  views/
    partials/        header.ejs, footer.ejs (incluídos com <%- include('partials/header') %>)
    publico/         páginas do site
    admin/           páginas do painel
  public/
    css/style.css    CSS gerado pelo Tailwind
    img/             imagens fixas do site (logo, banners)
uploads/             fotos enviadas pelo admin (NÃO vai para o Git)
```

- Arquivos de `frontend/public` são acessados por `/css/...`, `/img/...`
- Fotos enviadas são acessadas pelo valor de `animal.fotoUrl` (ex.: `/uploads/abc123.jpg`), use direto no `src`.

## Formato de um animal

```ts
type Animal = {
  id: string;            // uuid
  nome: string;
  especie: string;       // ex.: "Cachorro", "Gato"
  idade: number | null;  // em anos; pode vir vazio
  descricao: string | null;
  fotoUrl: string | null; // pode vir vazio → mostrar imagem padrão
  adotado: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

Sempre trate `idade`, `descricao` e `fotoUrl` vazios. Exemplo:

```ejs
<img src="<%= animal.fotoUrl || '/img/sem-foto.png' %>" alt="Foto de <%= animal.nome %>">
<% if (animal.idade !== null) { %><p><%= animal.idade %> ano(s)</p><% } %>
```

> Use sempre `<%= ... %>` (com escape) para dados que vêm do banco. `<%- ... %>` só para `include`.

## Variáveis presentes em todas as páginas

| Variável | Tipo | Uso |
|---|---|---|
| `titulo` | string | `<title>` da página |

## Site público

| Rota | View | Variáveis |
|---|---|---|
| `GET /` | `publico/inicio.ejs` | `titulo`, `destaques: Animal[]` (até 3 não adotados, mais recentes) |
| `GET /sobre` | `publico/sobre.ejs` | `titulo` |
| `GET /animais` | `publico/animais.ejs` | `titulo`, `animais: Animal[]` (só não adotados) |
| `GET /animais/:id` | `publico/animal.ejs` | `titulo`, `animal: Animal` (opcional, página de detalhe) |
| `GET /como-ajudar` | `publico/como-ajudar.ejs` | `titulo`, `pix: { chave: string, nome: string }` |
| `GET /contato` | `publico/contato.ejs` | `titulo` |
| qualquer rota inexistente | `publico/404.ejs` | `titulo` |

**Nenhuma página pública tem link para `/admin`.**

## Painel do admin

| Rota | View | Variáveis |
|---|---|---|
| `GET /admin/login` | `admin/login.ejs` | `titulo`, `erro: string \| null` |
| `GET /admin` | `admin/painel.ejs` | `titulo`, `animais: Animal[]` (todos), `mensagem: string \| null` |
| `GET /admin/animais/novo` | `admin/form-animal.ejs` | `titulo`, `animal: null`, `erros: Record<string,string>`, `valores: object` |
| `GET /admin/animais/:id/editar` | `admin/form-animal.ejs` | `titulo`, `animal: Animal`, `erros`, `valores` |

`erros` e `valores` servem para reexibir o formulário quando a validação falha
(ex.: `erros.nome = "Nome é obrigatório"`, `valores.nome = "o que a pessoa digitou"`).

## Formulários (o que o HTML precisa enviar)

HTML puro só envia `GET` e `POST`, por isso editar e remover usam `POST` com URL própria.

| Ação | `method` / `action` | `enctype` | Campos (`name`) |
|---|---|---|---|
| Login | `POST /admin/login` | padrão | `email`, `password` |
| Logout | `POST /admin/logout` | padrão | — |
| Cadastrar animal | `POST /admin/animais` | `multipart/form-data` | `nome`*, `especie`*, `idade`, `descricao`, `foto` (input `type="file" accept="image/*"`) |
| Editar animal | `POST /admin/animais/:id` | `multipart/form-data` | mesmos campos; `foto` vazio = mantém a atual |
| Marcar adotado / disponível | `POST /admin/animais/:id/adotado` | padrão | `adotado` = `"true"` ou `"false"` |
| Remover | `POST /admin/animais/:id/remover` | padrão | — (use `onsubmit="return confirm('Remover?')"`) |

\* obrigatório. Foto: JPG, PNG ou WEBP, até 5 MB.

Depois de cada ação o servidor redireciona (`/admin` ou de volta ao formulário com erros).
