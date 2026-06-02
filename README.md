# [Nome do Projeto]

> [!NOTE]
> Este projeto foi inicializado utilizando o **Project Foundation Protocol v1**. A estrutura abaixo Ã© focada em governanÃ§a clara, rastreabilidade tÃ©cnica e cooperaÃ§Ã£o fluida entre desenvolvedor humano e assistentes de InteligÃªncia Artificial.

## VisÃ£o Geral

[Descreva aqui o propÃ³sito geral do projeto, seus objetivos estratÃ©gicos e principais entregÃ¡veis.]

## Estrutura do RepositÃ³rio

O projeto segue a estrutura padrÃ£o de pastas e arquivos de controle:

```text
â”œâ”€â”€ .claude/                # ConfiguraÃ§Ãµes e regras locais do Claude Code
â”œâ”€â”€ agents.d/               # DefiniÃ§Ãµes de subagentes e prompts especÃ­ficos
â”œâ”€â”€ ai-memory/              # MemÃ³ria local e viva do projeto (fonte da verdade)
â”‚   â”œâ”€â”€ README.md           # Guia de manutenÃ§Ã£o e leitura da memÃ³ria
â”‚   â”œâ”€â”€ 00-global-profile.md
â”‚   â”œâ”€â”€ 01-project-context.md
â”‚   â”œâ”€â”€ 02-product-positioning.md
â”‚   â”œâ”€â”€ 03-design-system.md
â”‚   â”œâ”€â”€ 04-content-style.md
â”‚   â”œâ”€â”€ 05-technical-decisions.md
â”‚   â”œâ”€â”€ 06-visual-decisions.md
â”‚   â”œâ”€â”€ 07-open-issues.md
â”‚   â”œâ”€â”€ 08-changelog.md
â”‚   â””â”€â”€ 09-do-not-repeat.md
â”œâ”€â”€ assets/                 # Ativos estÃ¡ticos pÃºblicos do produto
â”‚   â”œâ”€â”€ fonts/              # Fontes locais do projeto
â”‚   â””â”€â”€ img/                # Imagens pÃºblicas do projeto
â”œâ”€â”€ docs/                   # DocumentaÃ§Ã£o detalhada e modular
â”‚   â”œâ”€â”€ decisions/          # Architectural Decision Records (ADRs)
â”‚   â”œâ”€â”€ design-system/      # Detalhamento de Design System e Tokens
â”‚   â”œâ”€â”€ reference/          # EspecificaÃ§Ãµes de negÃ³cios e referÃªncias
â”‚   â”œâ”€â”€ setup/              # Guias de instalaÃ§Ã£o e ambientes locais
â”‚   â””â”€â”€ validation/         # Quality gates e checklists de teste/acessibilidade
â”œâ”€â”€ AGENTS.md               # ConstituiÃ§Ã£o operacional e responsabilidades dos agentes
â”œâ”€â”€ CLAUDE.md               # InstruÃ§Ãµes operacionais especÃ­ficas para o Claude Code
â”œâ”€â”€ GEMINI.md               # InstruÃ§Ãµes operacionais especÃ­ficas para o Gemini/Antigravity
â”œâ”€â”€ PROJECT_CONTROL.md      # Metadados de controle, handoffs e histÃ³rico factual de sessÃµes
â”œâ”€â”€ README.md               # Este arquivo de documentaÃ§Ã£o inicial
â””â”€â”€ .gitignore              # Arquivos ignorados pelo Git
```

## Como ComeÃ§ar

1. **Leitura de Contexto**: Antes de abrir qualquer terminal ou modificar cÃ³digo, os assistentes de IA (e novos desenvolvedores) devem ler os arquivos de governanÃ§a na seguinte ordem:
   1. `PROJECT_CONTROL.md`
   2. `AGENTS.md`
   3. `GEMINI.md` ou `CLAUDE.md` (conforme a IA em uso)
   4. `ai-memory/README.md`
2. **Ambiente Local**: Consulte [docs/setup/](docs/setup/) para instruÃ§Ãµes detalhadas sobre como configurar o ambiente e executar os comandos locais.
3. **PadrÃ£o de Qualidade**: Todos os entregÃ¡veis devem ser validados de acordo com as especificaÃ§Ãµes em [docs/validation/](docs/validation/) antes de serem consolidados ou promovidos para a branch principal.

## ContribuiÃ§Ã£o e GovernanÃ§a

- **Henrico Amaral** Ã© o tomador de decisÃµes estratÃ©gicas e assinante final do escopo.
- **MudanÃ§as estruturais**: Devem sempre passar por uma branch dedicada (ex: `docs/...`, `fix/...`, `design/...`) e ter um plano de aÃ§Ã£o aprovado em `PROJECT_CONTROL.md` antes de qualquer merge em `main`.

