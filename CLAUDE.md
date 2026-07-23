# CLAUDE.md — Landing Factory · Destrava Co.

## O que é este repositório
Fábrica de páginas de captura da Destrava Co. Cada produto é 1 pasta com um `produto.yaml`. O build gera páginas estáticas com a identidade travada da marca; o deploy roda no Cloudflare Pages; o formulário envia leads ao MailerLite via Pages Function. Meta: produto novo no ar sem retrabalho manual e sem ferramenta visual frágil.

## Missão
1 produto novo = copiar pasta, editar o yaml, push, testar, merge. Nada além disso.

## Arquitetura (fluxo)
`produto.yaml` → `scripts/build.js` (injeta a paleta travada da linha) → `dist/{slug}/index.html` + `obrigado.html` → Cloudflare Pages → form POST `/api/subscribe` (`functions/api/subscribe.js`) → MailerLite (grupo do produto) → automação existente entrega o PDF.

## Estrutura de pastas
```
produtos/{slug}/produto.yaml   # fonte de verdade de cada produto
templates/                     # landing.html + obrigado.html ({{PLACEHOLDERS}})
scripts/build.js               # gerador + paleta travada + trava de placeholder
functions/api/subscribe.js     # integração MailerLite (token só em env)
tests/landing.spec.js          # gate Playwright de publicação
docs/                          # PLAYBOOK-TESTE.md · DEPLOY.md · ADRs
dist/                          # GERADO — nunca editar, nunca commitar
```

## Comandos essenciais
```
npm install                          # primeira vez
npm run build                        # gera dist/ — falha se sobrar {{placeholder}} ou linha inválida
npx playwright install chromium      # primeira vez (gate)
BASE_URL=https://<preview>.pages.dev EMAIL_TESTE=destravaco+pw@gmail.com npm test
```

## Fluxo padrão: produto novo
1. `cp -r produtos/receitas-15min produtos/<slug-novo>` e editar o `produto.yaml` (zerar todos os SUBSTITUIR).
2. Branch nova + push → o Cloudflare gera a URL de preview.
3. Rodar `docs/PLAYBOOK-TESTE.md` completo contra o preview (inclui `npm test`).
4. 100% verde → merge na main → produção. Vermelho → corrigir e repetir. Nunca pular o playbook.

## Convenções
- pt-BR em tudo que o usuário vê. Slug em kebab-case, sem acento (`receitas-15min`).
- Conteúdo mora SÓ no `produto.yaml`. Nunca hardcode texto de produto em template.
- Placeholder novo = `{{MAIUSCULA}}` no template **e** entrada no `map` do build.js — nos dois, sempre.
- Tipografia: **Lora** (títulos) + **Inter** (resto). Nenhuma outra fonte, nunca.
- O objeto `PALETAS` do build.js espelha o doc travado de cores v2 (2026-06-26). Alterar hex só com autorização explícita do Victor.
- `grupo_id` sempre string entre aspas no yaml.
- Campo e-mail é SEMPRE `type="email"` (bug histórico — o teste 1 do gate vigia isso).
- Checkbox de consentimento: obrigatória e NUNCA pré-marcada.
- Commits pequenos e descritivos; 1 produto por branch/PR.

## Segredos e segurança
- `MAILERLITE_API_TOKEN`: só em variável de ambiente do Cloudflare (Production **e** Preview). Nunca em código, yaml, commit ou log.
- `.env*` e `dist/` estão no `.gitignore` — manter assim.
- O honeypot (campo `site`) faz parte do form: não remover.
- `ALLOWED_GROUPS` (env opcional) restringe os grupos que a function aceita — recomendado em produção.

## Travas éticas — inegociáveis (herdadas do prompt-mãe §4)
Valem para QUALQUER copy escrita neste repositório:
- Sem resultado garantido, sem kg/prazo/quantidade prometida, sem cura, sem renda garantida.
- Sem depoimento, prova social, número ou estatística inventada.
- Sem escassez falsa, contador falso ou âncora de preço inventada.
- Captura só com consentimento explícito (LGPD); página só vai ao ar com Política de Privacidade publicada e linkada.
- Nicho sensível (saúde, emagrecimento, finanças): linguagem educativa + promessa realista + aviso quando couber.
- Promessa da página = conteúdo real do PDF. Divergiu, não publica.

## Definição de pronto
"Pronto" só vale testado de verdade: build ok + 3 testes do gate verdes contra o preview + assinante no grupo certo + e-mail da automação recebido + PDF abrindo + checagem em celular real. Está tudo em `docs/PLAYBOOK-TESTE.md`.

## O que NUNCA fazer neste repositório
- Publicar sem o playbook completo.
- Editar arquivos em `dist/` (são gerados; correção é no yaml ou no template).
- Commitar segredo, token ou `.env`.
- Mudar hex da paleta, trocar fontes ou remover a trava de placeholder sem autorização.
- Ação destrutiva (deletar produto, force push, `rm -rf`) sem confirmação explícita do Victor.

## Referências
- `docs/PLAYBOOK-TESTE.md` — gate obrigatório pré-publicação
- `docs/DEPLOY.md` — setup Cloudflare + domínio (feito uma vez)
- `docs/ADR-001-fundacao.md` — por que esta arquitetura existe
