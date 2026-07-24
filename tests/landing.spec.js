// tests/landing.spec.js — Gate de publicação da Landing Factory
// Rodar contra a URL de PREVIEW antes de todo go-live:
//   BASE_URL=https://xxxx.landing-factory.pages.dev EMAIL_TESTE=destravaco+pw@gmail.com npx playwright test tests
import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL;
const SLUG = process.env.SLUG || 'receitas-15min';
const EMAIL_TESTE = process.env.EMAIL_TESTE; // recebe o e-mail real da automação

test.beforeEach(async ({ page }) => {
  if (!BASE) throw new Error('Defina BASE_URL apontando para o deploy de preview.');
  await page.goto(`${BASE}/${SLUG}/`);
});

test('campos existem com o TIPO certo (trava do bug MailerLite)', async ({ page }) => {
  const email = page.locator('input[name="email"]');
  await expect(email).toHaveAttribute('type', 'email');        // <- o bug antigo era exatamente aqui
  await expect(page.locator('input[name="nome"]')).toHaveAttribute('type', 'text');
  const consent = page.locator('input[name="consentimento"]');
  await expect(consent).toHaveAttribute('type', 'checkbox');
  expect(await consent.evaluate((el) => el.required)).toBe(true);
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test('sem consentimento, o envio não passa', async ({ page }) => {
  await page.fill('input[name="nome"]', 'Teste Gate');
  await page.fill('input[name="email"]', 'gate@example.com');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(new RegExp(`${SLUG}/$`)); // continua na página, sem redirect
});

test('cadastro real termina na página de obrigado', async ({ page }) => {
  test.skip(!EMAIL_TESTE, 'Defina EMAIL_TESTE para rodar o cadastro real.');
  const email = EMAIL_TESTE.replace('@', `+${Date.now()}@`); // ex.: destravaco+1751234@gmail.com
  await page.fill('input[name="nome"]', 'Playwright Gate');
  await page.fill('input[name="email"]', email);
  await page.check('input[name="consentimento"]');
  await page.click('button[type="submit"]');
  await page.waitForURL(/obrigado(\.html)?$/, { timeout: 15000 }); // Cloudflare Pages encurta obrigado.html -> /obrigado
  await expect(page.locator('h1')).toBeVisible();
  console.log(`Cadastro de teste enviado: ${email} — conferir grupo no MailerLite + e-mail da automação.`);
});
