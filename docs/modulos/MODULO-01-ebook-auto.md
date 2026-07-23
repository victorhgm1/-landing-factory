# MÓDULO 01 — EBOOK AUTO
**Status:** spec (não construído) · **Prioridade: P3** — entra quando o 2º vertical (Bolso) sair do papel; até lá o Gamma pago cobre.

## Missão
Transformar conteúdo APROVADO (capítulos prontos) em PDF diagramado com a identidade travada + capa da linha, por código — eliminando a dependência do Gamma e o retrabalho de diagramação. O módulo NÃO redige conteúdo: texto é input humano, nunca output do módulo.

## Input esperado (produto.yaml estendido)
```yaml
ebook:
  subtitulo_capa: "21 dias para..."
  capitulos:
    - titulo: "Semana 1 — Destravar"
      arquivo: conteudo/cap-01.md   # texto pronto, escrito fora do módulo
  paginas_extras: [aviso-legal, licenca]
```

## Output esperado
- `dist-ebook/{slug}/ebook.pdf` — miolo diagramado (Lora títulos / Inter corpo, paleta da linha, muito respiro).
- `capa.png` — padrão capa de ebook do doc de cores: campo profundo + título creme.
- Checklist de revisão manual pré-publicação (marca d'água zero, links ok, promessa = conteúdo).

## Dependências
Pipeline HTML→PDF a decidir em ADR próprio (Playwright print ou equivalente) · fontes Lora/Inter embutidas · doc de cores v2 · conteúdo revisado por humano ANTES de entrar.

## Critério de sucesso
Dado 1 yaml + capítulos .md: PDF completo sai em 1 comando; lado a lado com o padrão atual, Victor (e esposa) aprovam o visual; zero marca d'água; links funcionando; §11 completo.

## Riscos
Quebra de página/viúvas em PDF gerado é traiçoeira — iterar com peça real, não com lorem ipsum · tentação de o módulo "melhorar" o texto — proibido · coerência promessa×conteúdo continua gate humano.
