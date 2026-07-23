# MÓDULO 02 — POSTS AUTO
**Status:** spec (não construído) · **Prioridade: P4** — só após a validação manual do orgânico atual (regra: validar antes de automatizar).

## Missão
Gerar por código os 8 posts de feed de um tema/produto, 100% dentro das regras travadas do agente Instagram: 4:5 (1080×1350), capa Wash 4 / miolo Wash 1 / CTA em campo profundo, escala tipográfica travada, zona segura de 8% topo/base, sem aspas, sem sombra, rodapé com tracinho no acento — eliminando o drift do gerador de imagem. O módulo diagrama; NÃO roteiriza (texto vem pronto do chat Instagram).

## Input esperado (produto.yaml estendido)
```yaml
posts:
  linha: cozinha
  pecas:
    - tipo: carrossel
      capa: { titulo: "...", fundo: wash4 }   # wash4 | forte — decisão do Victor
      slides: [ { titulo: "...", corpo: "..." } ]
      cta: { titulo: "...", botao: "..." }
      legenda: "..."
      hashtags: [5 do banco da linha, rotacionadas]
```

## Output esperado
PNGs 1080×1350 nomeados `AAAA_MM_DD_-_Carrossel_Linha_NN.png` + `legenda.txt` (gancho na 1ª linha, linha em branco, 5 hashtags) + alt-text por lâmina.

## Dependências
Renderização determinística (PIL/HTML headless) com Lora/Inter locais · regras do doc Instagram codificadas como TESTES (o build reprova se texto invadir a zona segura, se houver aspas, se o acento não for o da linha) · par A/B de capas da linha definido · textos prontos do especialista de canal.

## Critério de sucesso
8 peças em 1 comando passam no checklist do agente Instagram sem retoque; no teste cego lado a lado com as lâminas atuais do GPT, Victor não distingue — ou prefere a do código.

## Riscos
Tipografia programática exige ajuste fino (quebras, entreletra) · automatizar antes de validar o formato no orgânico = desperdício (gate de fase) · copy fora das travas §4 nunca entra — texto é input humano validado.
