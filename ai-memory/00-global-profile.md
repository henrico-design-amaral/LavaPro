# 00 · Perfil global

> LavaPro é um cockpit operacional para lava-rápidos pequenos. Offline-first. Validação antes de escala.

## Quem é

- **Produto**: ferramenta de operação, não vitrine.
- **Usuário primário**: operador(a) do lava-rápido, que gerencia fila, atendimento, estoque e fechamento do dia.
- **Usuário secundário**: dono(a), que olha fechamento e ajusta preços/estoque.

## Quem não é (ainda)

- Não é multi-tenant. Não é cloud. Não é SaaS.
- Não é uma plataforma para o cliente final.
- Não é uma rede de lava-rápidos.

## Princípios de produto

1. **Operação local antes de escala.** Um único operador, um único turno, um único banco SQLite. Sem cloud, sem auth, sem multi-tenant.
2. **Fechamento do dia é a estrela.** Se o relatório diário estiver errado, nada importa. Testar em todo ciclo de validação.
3. **Estoque amarrado à ordem.** Conclusão da OS baixa o estoque automaticamente. Ajuste manual sempre disponível.
4. **Fórmula de consumo explícita.** `consumo = base × fatorPorTamanho`. Auditável, ajustável.
5. **Estética de cockpit.** Tema dark, denso, sem decoração, com tipografia tabular e contraste alto.
