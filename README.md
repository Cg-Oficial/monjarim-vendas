# Monjarim

## Publicação no GitHub Pages

O workflow em `.github/workflows/deploy-pages.yml` compila e publica o site quando há atualização nas branches `main` ou `master`.

1. O caminho do site está configurado para o repositório `Cg-Oficial/monjarim-vendas`.
2. No GitHub, abra **Settings → Pages** e escolha **GitHub Actions** como origem da publicação.
3. Envie o projeto completo para `main` ou `master`. O workflow publica o conteúdo de `dist` e mostra o endereço em **Actions**.

O endereço esperado do site é `https://cg-oficial.github.io/monjarim-vendas/`. A publicação só fica ativa depois que o workflow concluir com sucesso.
