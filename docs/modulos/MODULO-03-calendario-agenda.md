# MÓDULO 03 — CALENDÁRIO / AGENDA
**Status:** spec (não construído) · **Prioridade: P5** — só faz sentido com o volume do Módulo 02 existindo.

## Missão
Transformar um lote de peças prontas em cronograma de publicação: datas, horários e ordem que respeitam a alternância travada do grid (Cozinha ↔ Corpo; par A/B de capa por linha) e o rodízio de hashtags — mantendo o Estado_do_Feed.md como memória viva.

## Input esperado (produto.yaml estendido)
```yaml
agenda:
  inicio: 2026-07-14
  cadencia: { feed_por_semana: 4, reels_por_semana: 2, stories_por_post: 3 }
  janelas: ["12:00-13:00", "19:30-21:00"]
  lote: [refs das peças do Módulo 02 + Reels da frente visual]
```

## Output esperado
`agenda.csv` + `agenda.md` (data · hora · peça · linha · tipo · legenda pronta · hashtags) + protocolo passo a passo de agendamento no Meta Business Suite + Estado_do_Feed.md atualizado.

## Dependências
Módulo 02 (peças) · regras de ritmo do grid (doc Instagram §6) · Estado_do_Feed inicializado.

## Critério de sucesso
Dado um lote, sai agenda de 2 semanas sem quebrar a alternância do grid nem repetir bloco de hashtags; Victor agenda tudo no Business Suite em menos de 30 min seguindo o protocolo.

## Riscos
Publicação 100% automática via API da Meta exige app/aprovação e gera sinal de spam — fase manual assistida primeiro · horários "ótimos" são hipótese: medir e ajustar, nunca afirmar · cadência acima da capacidade real de produção quebra a constância (a agenda respeita o estoque, não o desejo).
