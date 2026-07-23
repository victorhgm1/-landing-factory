# /tests — o gate de publicação
`landing.spec.js` roda contra a URL de PREVIEW, nunca só local:
`BASE_URL=... EMAIL_TESTE=... npx playwright test tests`
- Teste 1: tipos de campo certos (a trava do bug histórico do e-mail).
- Teste 2: sem consentimento, não envia.
- Teste 3: cadastro REAL até a página de obrigado.
Qualquer vermelho = não publica. O restante do gate humano está em docs/PLAYBOOK-TESTE.md.
