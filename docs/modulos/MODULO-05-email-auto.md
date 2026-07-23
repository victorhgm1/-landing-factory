# MÓDULO 05 — EMAIL AUTO
**Status:** spec (não construído) · **Prioridade: P1** — toca o gargalo atual (sequência no ar) e todo produto futuro precisa.

## Missão
Padronizar e acelerar a montagem das sequências (boas-vindas + venda) no MailerLite a partir do yaml: gerar os e-mails prontos (assunto, corpo, CTA) no tom da marca e nas travas §4, e automatizar o que a API permitir.

## Restrição estrutural (verificada — molda o desenho)
A API do MailerLite NÃO cria nem edita automações: o builder de automação é visual e vive só no painel. A API cria/atualiza assinantes, grupos e campanhas (broadcasts). Logo o módulo tem 2 camadas:
- **(a) Sempre:** geração dos e-mails prontos + protocolo de montagem passo a passo no automation builder + checklist de verificação.
- **(b) Onde couber:** criação de campanhas pontuais via API (broadcasts, avisos), nunca prometendo automação criada por código.

## Input esperado (produto.yaml estendido)
```yaml
emails:
  grupo_gatilho: "id do grupo do produto"
  assinatura: "Equipe Destrava Co."
  sequencia:
    - { dia: 0, tipo: entrega, objetivo: "entregar PDF + primeira vitória" }
    - { dia: 2, tipo: valor,   objetivo: "uso rápido do material" }
    - { dia: 4, tipo: ponte,   objetivo: "dor da rotina -> produto" }
    - { dia: 7, tipo: oferta,  cta_url: "checkout", objetivo: "convite direto, sem urgência falsa" }
```

## Output esperado
`emails/{slug}/email-0X.md` (assunto + corpo + CTA prontos pra colar) · protocolo numerado de montagem no builder · checklist de teste: cadastro real dispara o Dia 0, links certos, descadastro funcionando, oferta chega no dia certo.

## Dependências
A sequência do Destrava 21 (escrita no outro chat) vira o molde v1 do formato · travas §4 em toda copy (validador antes de subir) · grupo por produto já criado.

## Critério de sucesso
Sequência nova montada e TESTADA de ponta a ponta (cadastro real → Dia 0 na caixa → oferta no dia certo → link no checkout certo) em menos de 2h de trabalho seguindo o protocolo.

## Riscos
Montagem manual no builder = protocolo tem que ser à prova de erro (passos numerados, prints) · copy de venda em nicho sensível exige promessa realista · entregabilidade: quando o domínio ativar, configurar remetente próprio + SPF/DKIM antes de escalar volume.
