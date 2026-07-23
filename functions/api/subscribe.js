// functions/api/subscribe.js — Cloudflare Pages Function
// Recebe o form da landing e cria/atualiza o assinante no MailerLite,
// já dentro do grupo do produto (o que dispara a automação de entrega).
// O token NUNCA vai pro navegador: fica em env MAILERLITE_API_TOKEN.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const json = (status, obj) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  let dados;
  try { dados = await request.json(); }
  catch { return json(400, { mensagem: 'Requisição inválida.' }); }

  // Honeypot: bot preencheu o campo invisível → finge sucesso e descarta.
  if (dados.site) return json(200, { ok: true });

  const nome = String(dados.nome || '').trim();
  const email = String(dados.email || '').trim().toLowerCase();
  const whatsapp = String(dados.whatsapp || '').trim();
  const grupo = String(dados.grupo || '').trim();

  if (!nome) return json(422, { mensagem: 'Informe seu nome.' });
  if (!EMAIL_RE.test(email)) return json(422, { mensagem: 'E-mail inválido. Confira e tente de novo.' });
  if (!dados.consentimento) return json(422, { mensagem: 'É preciso marcar o consentimento para receber os e-mails.' });
  if (!grupo || grupo === 'SUBSTITUIR') return json(500, { mensagem: 'Página sem grupo configurado. Avise o suporte.' });

  // Trava opcional: só aceita grupos autorizados (env ALLOWED_GROUPS="id1,id2").
  if (env.ALLOWED_GROUPS && !env.ALLOWED_GROUPS.split(',').map(s => s.trim()).includes(grupo)) {
    return json(403, { mensagem: 'Grupo não autorizado.' });
  }

  const payload = { email, fields: { name: nome }, groups: [grupo] };
  if (whatsapp) payload.fields.phone = whatsapp;

  let r;
  try {
    r = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${env.MAILERLITE_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error('MailerLite indisponível:', e);
    return json(502, { mensagem: 'Serviço indisponível agora. Tente de novo em instantes.' });
  }

  if (r.status === 200 || r.status === 201) return json(200, { ok: true });

  const corpo = await r.text();
  console.error('MailerLite erro', r.status, corpo);
  if (r.status === 401) return json(500, { mensagem: 'Configuração de acesso inválida. Avise o suporte.' });
  if (r.status === 422) return json(422, { mensagem: 'Dados recusados. Confira o e-mail informado.' });
  if (r.status === 429) return json(429, { mensagem: 'Muitas tentativas agora. Aguarde um instante e tente de novo.' });
  return json(502, { mensagem: 'Não foi possível concluir agora. Tente de novo.' });
}
