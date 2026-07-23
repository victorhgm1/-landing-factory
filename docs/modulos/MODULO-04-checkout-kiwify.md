# MÓDULO 04 — CHECKOUT KIWIFY + PÁGINA DE VENDAS
**Status:** spec (não construído) · **Prioridade: P2** — é o que destrava o 2º vertical (Bolso) com custo marginal zero de página.

## Missão
Estender a fábrica para produtos PAGOS: gerar a página de vendas (`venda.html` com identidade da linha — promessa, entregáveis, garantia, FAQ, aviso legal, preço) apontando para o checkout Kiwify, e padronizar a configuração Kiwify por checklist. Regra de ouro: preço idêntico em página, botão e checkout, sempre.

## Input esperado (produto.yaml estendido)
```yaml
venda:
  preco: "R$37,90"
  garantia_dias: 7
  checkout_url: "https://pay.kiwify.com.br/..."
  secoes:
    promessa: "..."
    entregaveis: ["...", "..."]
    faq: [ { p: "...", r: "..." } ]
    aviso_legal: "..."   # obrigatório em nicho sensível
```

## Output esperado
- `dist/{slug}/venda.html` no mesmo projeto Pages (a captura e a venda moram juntas).
- Checklist Kiwify por produto: produto, preço, área de membros, e-mail de entrega, order bump quando houver.
- Gate Playwright estendido: preço exibido == preço do yaml · botão abre o checkout certo · aviso legal presente.

## Dependências
Template `venda.html` novo (irmão do landing.html) · **PESQUISA OBRIGATÓRIA como 1ª tarefa do módulo:** capacidades reais da API/webhooks da Kiwify hoje (criação de produto possivelmente manual; webhooks de venda para automação pós-compra) — não afirmar sem verificar (§5) · página Atoms atual segue no ar até este módulo vencer em teste real.

## Critério de sucesso
Produto pago novo no ar com página + checkout testados por COMPRA REAL (e reembolso) em menos de 1 dia de trabalho; preço idêntico nos 3 pontos; §11 completo.

## Riscos
Divergência de preço página×checkout (o gate vigia por código) · duplicidade com a Atoms ativa — definir data de corte quando o módulo provar superioridade · prometer automação que a Kiwify não expõe (incerteza declarada até a pesquisa).
