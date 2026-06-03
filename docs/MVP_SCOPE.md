# MVP_SCOPE — LavaPro

> Documento de escopo. Tudo que está aqui está dentro do MVP. Tudo que não está aqui está fora.

## Tese

Validar a operação de um lava-rápido pequeno com um produto **local-first** antes de qualquer decisão de escala.

## Frase-guia

Pense simples. Faça melhor. Torne-se inevitável.

## Quem usa

- **Operador(a) do lava-rápido**: gerencia fila, atendimento, estoque e fechamento.
- **Dono(a)**: olha o fechamento do dia, ajusta preços e reponde estoque.

Não há, no MVP:

- Cliente final usando o app.
- Mais de um operador simultâneo.
- Mais de um negócio no mesmo banco.

## Stack obrigatória

- Next.js 14 (App Router)
- TypeScript estrito
- SQLite local (`prisma/dev.db`)
- Prisma 5 estável
- Tailwind CSS 3
- Componentes próprios, simples, sem dependência de UI kit

## Não-objetivos explícitos (não constroem, não instalam)

- Hospedagem em nuvem.
- Postgres.
- Autenticação.
- Multi-tenant.
- RBAC.
- Billing.
- Reseller.
- Feature flags.
- PWA offline-cache.
- Push notifications.
- Sync entre dispositivos.

Esses itens podem entrar **depois** da validação. Estão listados aqui para que ninguém tente trazê-los de volta como "dependência inevitável".

## Módulos

### 1. Dashboard operacional
- Serviços hoje
- Fila
- Em execução
- Concluídos
- Receita do dia
- Custo químico estimado
- Margem bruta estimada
- Estoque baixo

### 2. Ordens de serviço
- Cliente
- Telefone
- Veículo
- Placa, marca, modelo, cor, tamanho
- Serviços contratados
- Preço
- Status
- Observações
- Timestamps (queued, started, completed, cancelled)

### 3. Fila
- Visual por status (lanes)
- Cards com cliente, veículo, placa, valor, tempo decorrido
- Iniciar / Concluir / Cancelar
- Reflete atualização via server actions

### 4. Clientes e veículos
- Cadastro de cliente
- Vínculo cliente → veículos (1:N)
- Histórico por placa

### 5. Catálogo de serviços
- Nome, descrição, preço base, duração
- Produtos consumidos com fator por tamanho de veículo

### 6. Estoque (SmartStock MVP)
- Produto, unidade, estoque atual, mínimo, custo unitário
- Regras de consumo por serviço e tamanho de veículo
- Baixa automática ao concluir OS
- Ajuste manual (compra, perda, ajuste)

### 7. Relatório diário
- Ordens concluídas no dia
- Receita
- Custo estimado
- Margem bruta
- Ticket médio
- Serviço mais vendido
- Alertas de estoque

## Status de ordem

- `QUEUED` (na fila)
- `IN_PROGRESS` (em execução)
- `COMPLETED` (concluída)
- `CANCELLED` (cancelada)

Transições permitidas:

- `QUEUED` → `IN_PROGRESS` → `COMPLETED`
- `QUEUED` → `CANCELLED`
- `IN_PROGRESS` → `CANCELLED`

## Fórmula de consumo

```
consumoRealEstimado = quantidadeBase × fatorPorTamanhoDoVeiculo
custoEstimado = consumoRealEstimado × custoUnitário
```

Fatores por tamanho:

- `SMALL` × 0.85
- `MEDIUM` × 1.00
- `LARGE` × 1.25
- `EXTRA_LARGE` × 1.60

## Modelo de dados

- `Business`
- `Customer`
- `Vehicle`
- `ServiceType`
- `Product`
- `ServiceProductUsage`
- `ServiceOrder`
- `ServiceOrderItem`
- `StockMovement`

## Seed

- 1 negócio
- 8 clientes
- 10 veículos
- 6 tipos de serviço
- 8 produtos químicos/materiais
- 12 ordens (6 concluídas, 2 em execução, 3 na fila, 1 cancelada)
- 34 movimentações de estoque (inicial + consumo simulado)

## Critérios de aceite

1. App abre localmente sem internet após `npm install`.
2. Dashboard mostra dados seedados.
3. Nova ordem pode ser criada via formulário.
4. Fila mostra ordens agrupadas por status.
5. Iniciar / Concluir / Cancelar altera o status e o timestamp.
6. Concluir uma OS reduz o estoque dos produtos envolvidos.
7. Relatório diário calcula receita, custo estimado e margem.
8. Lint, typecheck e build passam sem warnings.
9. Não há chamada externa em runtime.
10. Tudo versionado em git na branch `rebuild/offline-first-mvp`.
