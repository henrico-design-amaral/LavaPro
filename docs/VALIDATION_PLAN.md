# VALIDATION_PLAN — LavaPro

Como validamos o MVP antes de qualquer decisão de próxima fase.

## Camadas de validação

### Camada 1 — Estática (CI local)

Rode, em ordem, e todas devem passar:

```bash
npm install
npm run db:push
npm run db:seed
npm run typecheck
npm run lint
npm run build
```

Critério de aceitação: zero erro, zero warning.

### Camada 2 — Comportamental (fluxos do operador)

Cada fluxo abaixo deve ser executado manualmente em `npm run dev` e produzir o efeito esperado:

#### F1. Abrir o painel
- Acessar `/`.
- Ver: receita do dia, custo, margem, ticket médio, top service, fila ativa, contagens.
- Ver pelo menos 6 ordens concluídas e 2 em execução vindas do seed.

#### F2. Criar uma ordem
- Acessar `/orders/new`.
- Selecionar um cliente seedado.
- Selecionar um veículo do cliente.
- Adicionar 1+ serviço com `+`.
- Submeter.
- Ser redirecionado para `/orders/{id}` com status `QUEUED`.
- Verificar que a ordem aparece na home e em `/queue` na coluna "Na fila".

#### F3. Iniciar uma ordem
- Em `/queue`, em um card `Na fila`, clicar `Iniciar`.
- O status muda para `Em execução`, startedAt é registrado.
- O card aparece na coluna "Em execução" sem reload manual.

#### F4. Concluir uma ordem
- Em uma ordem `Em execução`, clicar `Concluir`.
- O status muda para `Concluído`, completedAt é registrado, totalCost é calculado.
- Verificar em `/inventory` que os estoques dos produtos consumidos diminuíram.
- Verificar que o `StockMovement` USAGE foi criado (atualmente visível indiretamente pelo estoque).

#### F5. Cancelar uma ordem
- Em uma ordem `Em execução`, clicar `Cancelar`.
- Confirmar no diálogo do navegador.
- O status muda para `Cancelado`, cancelledAt é registrado.
- O estoque **não** é alterado.

#### F6. Ajustar estoque manualmente
- Em `/inventory`, em um produto, clicar `Ajustar`.
- Inserir `+1000` (compra), `-50` (ajuste) ou `-20` (perda).
- Submeter.
- Estoque do produto é alterado e um `StockMovement` é registrado.

#### F7. Cadastrar cliente
- Em `/customers`, clicar `Novo cliente`.
- Preencher nome, telefone.
- Submeter.
- Ser redirecionado para `/customers/{id}` com 0 veículos e 0 ordens.

#### F8. Adicionar veículo a um cliente
- Em `/customers/{id}`, clicar `+ Adicionar veículo`.
- Preencher placa, marca, modelo, cor, tamanho.
- Submeter.
- Voltar para o detalhe do cliente. O novo veículo aparece.

#### F9. Relatório diário
- Em `/reports`, ver: receita, custo, margem, ticket médio, mix de serviços, alertas de estoque.
- Conferir que os números batem com o seed (6 ordens concluídas no dia).
- Conferir que o item `Lavagem completa` ou `Polimento cristalizado` aparece como mais vendido conforme os volumes do seed.

### Camada 3 — Acessibilidade (manual)

Em cada tela, validar:

- [ ] Tab navega por todos os controles visíveis na ordem do DOM.
- [ ] Cada controle tem um foco visível (anel accent-500).
- [ ] Cada input tem um `<label>` associado.
- [ ] Status é lido pelo leitor de tela (texto + dot, não só cor).
- [ ] `prefers-reduced-motion: reduce` desabilita animações (testar em DevTools → Rendering → Emulate CSS media feature).
- [ ] Contraste de texto body ≥ 4.5:1 (validar com DevTools → Accessibility → Contrast).

### Camada 4 — Operacional (turno real, opcional no MVP)

Esta camada exige um lava-rápido real:

- Instalar em uma máquina no local.
- Operar 1 turno completo (manhã ou tarde).
- Sem internet. Sem fallback. Sem cloud.
- Anotar fricções, latências percebidas, dúvidas.
- Anotar o que está faltando e classificar: bloqueante, importante, nice-to-have.

Só após a Camada 4 ser concluída é que o produto pode ser considerado validado para a próxima fase.

## Critério de "MVP validado"

- Camada 1: passa.
- Camada 2: todos os 9 fluxos (F1–F9) passam.
- Camada 3: zero item abaixo de "atende fortemente" (score 2) no checklist.
- Camada 4: pelo menos 1 turno real sem bloqueante.

## Fechamento da validação

Após cada bateria de validação, registrar em `docs/IMPLEMENTATION_LOG.md`:

- Data, branch, commit.
- Comandos executados.
- Resultados (passa/falha) de cada item das camadas 1–3.
- Pendências.

Se algum item falhar, abrir issue local (ou nota no log) e corrigir antes de declarar a validação concluída.
