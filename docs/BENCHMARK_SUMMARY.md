# BENCHMARK_SUMMARY — LavaPro

> Resumo do que aprendemos com produtos da categoria para informar o MVP. Sem cópias de código. Apenas padrões e armadilhas.

## Produtos observados

### DRB / Washify
- **Força**: foco extremo no fluxo de ordem de serviço para lava-rápidos e detailing. Tudo o que não é ordem está a um clique de distância.
- **Padrão a absorver**: telas de fila e detalhe de OS com status em uma faixa sempre visível no topo, com `Iniciar` / `Concluir` sempre no mesmo lugar.
- **Armadilha a evitar**: dependencia de leitura de placa por OCR/LPR como pré-requisito. No LavaPro MVP, placa é digitada uma vez e fica.

### Shopmonkey
- **Força**: inventário bem amarrado à OS, com cálculo automático de peças consumidas.
- **Padrão a absorver**: o `ServiceProductUsage` (serviço → produto + fator) com cálculo automático na conclusão da OS.
- **Armadilha a evitar**: complexidade de ordens de reparo mecânico (sub-ordens, fornecedores, garantias). Lava-rápido é mais simples; não trazer essa bagagem.

### AutoLeap
- **Força**: dashboard limpo com KPIs que o dono do negócio entende sem treinamento.
- **Padrão a absorver**: destaque de receita do dia + ticket médio + top service, todos visíveis no primeiro scroll.
- **Armadilha a evitar**: dependência de conexão para renderizar dashboard. O LavaPro é offline-first.

### Jobber
- **Força**: agenda + visita técnica + invoice em um único fluxo.
- **Padrão a absorver**: linha do tempo da OS (queued → started → completed/cancelled) sempre visível no detalhe.
- **Armadilha a evitar**: agendamento futuro complexo. Lava-rápido é walk-in. A fila é o que importa.

### Mangomint
- **Força**:UI premium, densa, com tipografia que respeita o operador.
- **Padrão a absorver**: usar numerics tabulares, hairline borders, e sem cores decorativas.
- **Armadilha a evitar**: glassmorphism e gradientes. Ficam bonitos em marketing, cansam em turno de 8h.

## Padrões consolidados para o LavaPro MVP

1. **Lanes de status** na tela de fila. Sempre quatro: `Na fila`, `Em execução`, `Concluído`, `Cancelado`. As duas primeiras lado a lado no topo; as duas últimas na seção "Histórico do turno".
2. **Cards de ordem com ação inline**. O `Iniciar` / `Concluir` / `Cancelar` mora dentro do próprio card, sem abrir modal.
3. **Detalhe de OS com 3 zonas**: KPIs no topo (valor, custo, margem), linha do tempo à esquerda, serviços contratados à direita.
4. **Estoque amarrado à OS**. A conclusão da ordem baixa o estoque automaticamente, e o ajuste manual está sempre disponível para correções.
5. **Relatório diário como canário**. Se o fechamento do dia estiver errado, nada importa. Teste em todo ciclo de validação.
6. **Catálogo de serviços com produtos visíveis**. O operador precisa ver o que cada serviço consome para decidir se aceita um pedido.
7. **Cliente → veículos → histórico por placa**. Uma visita recorrente não pode exigir re-digitar tudo.

## Anti-padrões a recusar

- **Multi-tenant antes da validação.** Nenhum lava-rápido pediu dois negócios no mesmo banco ainda.
- **Auth antes do problema.** A máquina é usada por uma pessoa de cada vez. Login é fricção sem ganho.
- **Sync entre dispositivos antes do problema.** Um lava-rápido tem um terminal. Se tiver mais, repensamos.
- **OCR/LPR como requisito.** Acelera, mas cria dependência de câmera e luz. No MVP, digitar placa é aceitável.
- **Pagamento integrado.** Pix, cartão e dinheiro são tratados fora do app. Fechar o caixa é conversa entre o operador e o cliente.
- **Marketing pages, blog, landing.** LavaPro é ferramenta de operação, não vitrine.

## Conclusão

O LavaPro MVP absorve o que há de melhor em produtos de serviço automotivo e descarta tudo que não cabe em um único operador em um único turno. A direção é: operação local, fechamento correto, beleza funcional, zero nuvem até segunda ordem.
