// scripts/build.js — Landing Factory · Destrava Co.
// Lê /produtos/*/produto.yaml e gera /dist/{slug}/index.html + obrigado.html
// Fonte das cores: 2026-06-26_Destrava-Co_Sistema-de-Cores-e-Tipografia (v2) — TRAVADO.
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const PALETAS = {
  corpo:   { campo: '#1E5B46', wash4: '#64B498', wash3: '#D1E6DF', wash1: '#EAF0EE', acento: '#E2714E' },
  cozinha: { campo: '#B54E33', wash4: '#D58F7D', wash3: '#EED4CD', wash1: '#F4EDEB', acento: '#E0A33A' },
  bolso:   { campo: '#18314B', wash4: '#5D86B0', wash3: '#D1DBE6', wash1: '#EAEDF0', acento: '#C8A24A' },
  rotina:  { campo: '#146966', wash4: '#61B9B6', wash3: '#D1E6E5', wash1: '#EAF0F0', acento: '#D98E5C' },
  garra:   { campo: '#A22D31', wash4: '#D27377', wash3: '#EECDCE', wash1: '#F4EBEB', acento: '#1C1B1A' },
  mente:   { campo: '#453C69', wash4: '#8579B5', wash3: '#D5D1E6', wash1: '#EBEAF0', acento: '#CD9A8E' },
  casa:    { campo: '#5E694C', wash4: '#A1B581', wash3: '#DEE6D1', wash1: '#EEF0EA', acento: '#D88C5A' },
};
const NEUTROS = { creme: '#F4EFE6', ink: '#1A1A17' };

const WHATSAPP_HTML = `<label for="whatsapp">WhatsApp (opcional)</label>
      <input id="whatsapp" name="whatsapp" type="tel" autocomplete="tel" inputmode="tel">`;

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const TPL = {
  landing: fs.readFileSync(path.join(ROOT, 'templates', 'landing.html'), 'utf8'),
  obrigado: fs.readFileSync(path.join(ROOT, 'templates', 'obrigado.html'), 'utf8'),
};

const render = (tpl, map) =>
  tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in map ? map[k] : m));

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const produtosDir = path.join(ROOT, 'produtos');
const pastas = fs.readdirSync(produtosDir).filter((d) =>
  fs.existsSync(path.join(produtosDir, d, 'produto.yaml'))
);
if (!pastas.length) throw new Error('Nenhum produto.yaml encontrado em /produtos.');

for (const pasta of pastas) {
  const cfg = yaml.load(fs.readFileSync(path.join(produtosDir, pasta, 'produto.yaml'), 'utf8'));
  const { produto: p, pagina: pg, form: fm, mailerlite: ml, obrigado: ob, legal: lg } = cfg;

  const pal = PALETAS[p.linha];
  if (!pal) throw new Error(`Linha desconhecida em ${pasta}: "${p.linha}". Válidas: ${Object.keys(PALETAS).join(', ')}`);

  const map = {
    NOME_PRODUTO: p.nome,
    KICKER: pg.kicker || '',
    TITULO: pg.titulo,
    SUBTITULO: pg.subtitulo || '',
    BENEFICIOS: (pg.beneficios || []).map((b) => `<li>${b}</li>`).join('\n      '),
    BOTAO: pg.botao,
    CONSENTIMENTO: fm.consentimento,
    CAMPO_WHATSAPP: fm.whatsapp ? WHATSAPP_HTML : '',
    GRUPO_ID: String(ml.grupo_id),
    OBRIGADO_TITULO: ob.titulo,
    OBRIGADO_TEXTO: ob.texto,
    EMPRESA: lg.empresa,
    ENDERECO: lg.endereco,
    POLITICA_URL: lg.politica_url,
    ANO: String(new Date().getFullYear()),
    CAMPO: pal.campo, WASH1: pal.wash1, WASH3: pal.wash3,
    ACENTO: pal.acento, CREME: NEUTROS.creme, INK: NEUTROS.ink,
  };

  const out = path.join(DIST, p.slug);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'index.html'), render(TPL.landing, map));
  fs.writeFileSync(path.join(out, 'obrigado.html'), render(TPL.obrigado, map));

  // Trava de build: nenhum placeholder pode sobrar no HTML final.
  for (const f of ['index.html', 'obrigado.html']) {
    const html = fs.readFileSync(path.join(out, f), 'utf8');
    const sobra = html.match(/\{\{\w+\}\}/g);
    if (sobra) throw new Error(`Placeholder sem valor em ${p.slug}/${f}: ${[...new Set(sobra)].join(', ')}`);
    // Trava anti-SUBSTITUIR: campo do yaml ficou sem preencher e vazou pro HTML.
    if (html.includes('SUBSTITUIR')) throw new Error(`Campo "SUBSTITUIR" não preenchido vazou para ${p.slug}/${f}. Preencha o produto.yaml antes de publicar.`);
  }
  console.log(`  ok  ${p.slug}  (linha: ${p.linha})`);
}
console.log(`Build concluído → ${DIST}`);
