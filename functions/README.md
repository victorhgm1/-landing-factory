# /functions — backend (Cloudflare Pages Functions)
`api/subscribe.js` recebe o form e cria/atualiza o assinante no MailerLite, já no grupo do produto.
- Token SÓ em env do Cloudflare (`MAILERLITE_API_TOKEN`) — nunca em código ou commit.
- `ALLOWED_GROUPS` (env opcional) limita os grupos aceitos.
- Não logar dados pessoais além do necessário para depurar erro.
