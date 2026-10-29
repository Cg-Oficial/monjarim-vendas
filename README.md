# Monjarim

## Publicação no GitHub Pages

O workflow em `.github/workflows/deploy-pages.yml` compila e publica o site quando há atualização nas branches `main` ou `master`.

1. Confirme que o repositório se chama `MOUJARIM` — o caminho público e os recursos do Vite usam esse nome.
2. No GitHub, abra **Settings → Pages** e escolha **GitHub Actions** como origem da publicação.
3. Envie as alterações para `main` ou `master`. O workflow publicará o conteúdo de `dist` e exibirá o endereço em **Actions**.

O GitHub Pages fornece HTTPS para o domínio publicado. Ele não aplica os cabeçalhos de resposta definidos em `vercel.json`; esses cabeçalhos só valem quando o site é hospedado na Vercel. Como o Pages é hospedagem estática, não há servidor próprio nem processamento de pagamentos neste projeto.

A conta e o repositório não são conectados automaticamente por este projeto; a primeira publicação depende do acesso do proprietário ao GitHub.
