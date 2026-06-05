# Demo estática para GitHub Pages

## Por que esta demo é estática

O GitHub Pages é documentado pelo GitHub como hospedagem estática para arquivos HTML, CSS e JavaScript servidos a partir de um repositório. Fonte: [GitHub Docs — About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages).

Por esse motivo, a camada pública do LavaPro fica isolada em `docs/site/` e contém apenas:

- `index.html`
- `styles.css`
- `app.js`

Ela usa dados demonstrativos derivados de `prisma/seed.ts`:

- 1 negócio
- 8 clientes
- 10 veículos
- 6 serviços
- 8 produtos
- 12 ordens
- 34 movimentos de estoque

## Por que o MVP completo não roda no GitHub Pages

O MVP funcional do LavaPro é uma aplicação local offline-first com Next.js, Prisma e SQLite. Essa aplicação exige execução local para consultas, mutações, persistência em banco e código server-side.

O GitHub Pages não fornece servidor de aplicação para Prisma, escrita em SQLite ou server actions do Next.js. A documentação do Next.js descreve `use server` como execução no servidor, e a documentação de exportação estática lista Server Actions como recurso não suportado nesse modo. Fontes: [Next.js `use server`](https://nextjs.org/docs/app/api-reference/directives/use-server) e [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports).

Portanto, este repositório não deve tentar publicar o MVP funcional no GitHub Pages. A publicação em Pages é somente uma demo de validação.

## Como publicar via GitHub Pages

O workflow `.github/workflows/pages.yml` publica `docs/site` usando GitHub Actions. A documentação do GitHub descreve workflows customizados de Pages com `configure-pages`, `upload-pages-artifact` e `deploy-pages`. Fonte: [GitHub Docs — Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Fluxo de publicação:

1. Enviar a branch `main` para o GitHub.
2. Configurar GitHub Pages para usar GitHub Actions como fonte.
3. Rodar o workflow `Deploy static demo to GitHub Pages` por push na `main` ou por `workflow_dispatch`.
4. Abrir a URL pública gerada pelo GitHub Pages.

## O que a demo valida

- Apresentação visual do cockpit operacional.
- Navegação estática entre as oito telas principais.
- Métricas de painel calculadas no navegador a partir de dados demonstrativos.
- Raias de fila por status.
- Tabela de ordens e estados operacionais.
- Prévia de nova OS com consumo planejado de estoque.
- Clientes e veículos cadastrados.
- Serviços com preços, duração e insumos.
- Alertas de Estoque / SmartStock e movimentos de estoque.
- Relatório diário com receita, custo, margem, ticket médio e mix de serviços.

## O que ainda exige execução local do MVP

- Persistência real em SQLite.
- Consultas e mutações via Prisma.
- Server actions do Next.js.
- Criação real de ordens, mudança de status e baixa de estoque.
- Validação local offline-first com `npm run dev`.
- Validação de build do MVP com `npm run build`.

Para rodar o MVP funcional:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```
