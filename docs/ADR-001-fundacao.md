# ADR-001 — Fundação da Landing Factory
**Status:** aceito · **Data:** 2026-07-05 · **Decisor:** Victor · **Registro:** agente estratégico Destrava Co.
*ADR = registro de decisão de arquitetura. Ler antes de propor mudança estrutural. Reverter uma decisão daqui exige novo ADR.*

---

## Decisão 1 — Cloudflare Pages + código próprio (não MailerLite Sites / no-code)

**Contexto.** A captura atual roda em página hospedada do MailerLite. Funciona, mas já produziu o pior tipo de falha: campo de e-mail com tipo trocado quebrando o cadastro **em silêncio** — sem erro visível, sem lead, sem aviso. Ferramenta visual não tem versionamento, não tem diff e não permite a regra central da operação: teste automático que REPROVA a publicação quando o formulário quebra.

**Decisão.** Páginas estáticas geradas por código próprio, hospedadas no Cloudflare Pages: preview por branch (onde o gate roda antes do merge), Functions no mesmo projeto (backend do form sem servidor separado), domínio + SSL no mesmo painel, plano gratuito cobrindo o uso atual.

**Alternativas descartadas.**
- **MailerLite Sites / landing nativa:** rápida, mas edição manual por produto, zero versionamento, zero gate automatizado — e a classe de bug já sofrida.
- **Tally / Fillout:** ótimos para form avulso; não entregam página com a identidade completa da marca nem gate por código. Continuam válidos como plano B de emergência.
- **Lovable / Bolt / Replit Agent:** geram código, mas adicionam camada paga e drift de estilo; o Claude Code já cobre a geração com controle total.
- **Netlify / Vercel:** equivalentes tecnicamente; Cloudflare escolhido por juntar Pages + Functions + DNS do domínio num painel só.

**Consequências.** (+) replicável, versionado, testável, custo marginal zero por produto novo. (−) exige Git/terminal — mitigado por Claude Code + CLAUDE.md. (−) setup de DNS uma única vez.

---

## Decisão 2 — produto.yaml como fonte de verdade

**Contexto.** Todo produto precisa dos mesmos campos (título, copy, grupo, consentimento, cores da linha). O conteúdo precisa ser editável do celular, sem tocar em HTML, e legível por máquina para o build ser determinístico.

**Decisão.** 1 arquivo `produto.yaml` por produto. O build injeta tudo; a paleta deriva do campo `linha` (tabela travada em código, espelho do doc de cores v2). Placeholder sem valor **derruba o build** — configuração incompleta não vira página quebrada no ar.

**Alternativas descartadas.**
- **briefing.md livre:** bom para humano, ambíguo para máquina — parsing vira adivinhação.
- **JSON:** determinístico, mas hostil à edição manual (sem comentário; uma vírgula quebra tudo).
- **CMS:** mais uma ferramenta, mais um custo mensal, mais um login — contra o princípio da operação.

**Consequências.** (+) 1 arquivo por produto, comentado, diffável, validado no build. (−) YAML é sensível a indentação — mitigado pelo build que falha alto e cedo.

---

## Decisão 3 — MailerLite via API (não form embutido, não cadastro manual)

**Contexto.** O funil de entrega já validado dispara quando o assinante **entra no grupo**. Falta controlar 100% do caminho form → grupo, sem depender do form visual do MailerLite (origem do bug histórico).

**Decisão.** Form próprio → Pages Function → `POST /api/subscribers` com o grupo do produto. Token só no servidor. A API faz upsert (lead repetido atualiza, não duplica nem dá erro) e a entrada no grupo aciona a automação existente.

**Alternativas descartadas.**
- **Form embutido do MailerLite:** briga de CSS, campos fora do nosso controle, mesma classe do bug antigo, sem honeypot próprio, sem tratamento de erro nosso.
- **Import manual / CSV:** quebra o tempo real, arrisca o gatilho da automação e enfraquece a trilha de consentimento LGPD.
- **n8n no meio do caminho:** válido no futuro para fluxos multi-etapa (CRM, WhatsApp oficial, logs centralizados); hoje seria peça móvel a mais antes da validação.

**Consequências.** (+) validação, mensagens de erro e UX 100% nossos; consentimento registrado no nosso fluxo; grupo certo garantido por código. (−) o suporte oficial do MailerLite a integrações custom é limitado — a rede de segurança é o gate Playwright + playbook. (−) mudança na API exige manutenção — monitorar o changelog deles.
