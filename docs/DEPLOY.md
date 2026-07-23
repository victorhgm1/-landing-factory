# DEPLOY — Cloudflare Pages + subdomínio destravaco.com.br
**Setup feito UMA vez. Produto novo depois = pasta nova em /produtos + push. Zero toque no Cloudflare.**

## 0. Pré-requisitos
- Repo privado no GitHub com esta estrutura.
- Local: Node 18+, `npm install && npm run build` funcionando.

## 1. Criar o projeto Pages
1. dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → escolher o repo.
2. Build command: `npm install && npm run build`
3. Build output directory: `dist`
4. A pasta `functions/` é detectada sozinha (vira o endpoint /api/subscribe).

## 2. Variáveis de ambiente (Settings → Environment variables — em Production E Preview)
- `MAILERLITE_API_TOKEN` = token gerado em MailerLite → Integrations → API (Use). Guardar SÓ aqui, nunca no código/repo.
- `ALLOWED_GROUPS` = id do grupo (opcional, recomendado: trava anti-abuso).

## 3. Primeiro deploy
- Salvar → deploy roda → testar em `https://{projeto}.pages.dev/receitas-15min/`.
- Todo push em branch ≠ main gera URL de PREVIEW → é nela que roda o PLAYBOOK-TESTE.

## 4. Domínio (uma vez só)
Caminho recomendado:
1. Cloudflare → Add site → `destravaco.com.br` → plano Free → anotar os 2 nameservers.
2. registro.br → painel do domínio → Alterar servidores DNS → colar os 2 nameservers (propagação pode levar horas).
3. No projeto Pages → Custom domains → `lp.destravaco.com.br` → SSL sai automático.

Alternativa sem mudar DNS: no painel DNS atual, criar CNAME `lp` → `{projeto}.pages.dev` e adicionar o custom domain no Pages.

## 5. Fluxo por produto novo (o coração da fábrica)
1. Copiar `/produtos/receitas-15min/` → `/produtos/{novo-slug}/` e editar o produto.yaml.
2. Push em branch → preview → PLAYBOOK-TESTE completo.
3. Verde? Merge na main → produção em `lp.destravaco.com.br/{novo-slug}/`.
