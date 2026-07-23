# /scripts — o gerador
`build.js` lê todos os `produtos/*/produto.yaml` e gera `dist/{slug}/`.
- Contém a tabela PALETAS (espelho do doc de cores v2, 2026-06-26) — hex não muda sem autorização.
- Falha de propósito se: linha inválida, yaml quebrado ou `{{placeholder}}` sobrando no HTML final.
- Rodar com `npm run build`. Nunca editar a saída em `dist/` na mão.
