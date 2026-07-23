# Landing Factory · Destrava Co.

Fábrica de páginas de captura: **1 produto = 1 `produto.yaml` → build → teste → ar.**
Identidade visual travada (Lora + Inter, paleta por linha), lead direto no grupo certo do MailerLite, entrega pela automação existente.

## Início rápido
```
npm install
npm run build          # gera dist/{slug}/
npx playwright install chromium
BASE_URL=https://<preview>.pages.dev EMAIL_TESTE=destravaco+pw@gmail.com npm test
```

## Produto novo (o coração da fábrica)
1. `cp -r produtos/receitas-15min produtos/<slug-novo>`
2. Editar o `produto.yaml` (zerar todos os SUBSTITUIR)
3. Branch + push → preview → `docs/PLAYBOOK-TESTE.md` completo
4. Verde → merge → produção em `lp.destravaco.com.br/<slug>/`

## Regras da casa
- **Pronto só vale testado.** O playbook não é opcional.
- Leia o `CLAUDE.md` antes de mexer em qualquer coisa.
- Decisões de arquitetura: `docs/ADR-001-fundacao.md`.
