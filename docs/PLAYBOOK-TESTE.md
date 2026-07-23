# PLAYBOOK DE TESTE — obrigatório antes de TODO go-live
**Landing Factory · Destrava Co. — "pronto" só vale testado de verdade.**
Rodar sempre contra a URL de PREVIEW. Só depois de 100% verde: produção.

## 1. Build
- [ ] `npm run build` roda sem erro e imprime `ok {slug}`.
- [ ] Nenhum `SUBSTITUIR` sobrou no produto.yaml (grupo_id, endereço, política).
- [ ] O próprio build já falha se sobrar placeholder `{{...}}` — se falhar, corrigir o yaml, nunca o HTML gerado.

## 2. Gate automático (Playwright)
```
BASE_URL=https://SEU-PREVIEW.pages.dev EMAIL_TESTE=destravaco+pw@gmail.com npx playwright test tests
```
- [ ] Teste 1 verde — campos com TIPO certo (email é `type=email`; a trava do bug antigo do MailerLite).
- [ ] Teste 2 verde — sem consentimento marcado, não envia.
- [ ] Teste 3 verde — cadastro real chega na página de obrigado.

## 3. Verificação humana no MailerLite (o teste 3 gera um assinante real)
- [ ] Assinante `destravaco+...@gmail.com` apareceu no GRUPO CERTO (não só na lista geral).
- [ ] E-mail da automação CHEGOU na caixa do Gmail (o truque do `+` entrega no destravaco@gmail.com).
- [ ] Link do PDF dentro do e-mail ABRE o PDF certo.
- [ ] Se a automação NÃO disparar via API: registrar e acionar plano B (trigger por campo/segmento) — decidir só se falhar.

## 4. Verificação humana na página (celular real)
- [ ] Abrir no celular: hero, formulário e botão legíveis sem zoom.
- [ ] Consentimento clicável e link da Política de Privacidade abre página publicada.
- [ ] Mensagem de erro aparece se enviar e-mail inválido.
- [ ] Página de obrigado com texto certo do produto.

## 5. Coerência e ética (§4)
- [ ] Promessa da página = conteúdo real do PDF (ex.: "até 15 minutos" exige o PDF corrigido — receita da gelatina).
- [ ] Sem urgência falsa, sem prova social inventada, sem promessa de resultado.

## 6. Limpeza
- [ ] Apagar (ou etiquetar `teste`) os assinantes de teste no MailerLite.

**Regra:** qualquer item vermelho = NÃO publica. Corrigir, rodar tudo de novo.
