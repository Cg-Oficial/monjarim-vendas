import { expect, test } from "@playwright/test";

test("navegacao e oferta especial levam ao checkout Braip", async ({ page, context }) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(navigation.getByRole("link", { name: "O Produto" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "A Fórmula" })).toBeVisible();
  await navigation.getByRole("link", { name: "O Produto" }).click();
  await expect(page).toHaveURL(/#produto$/);
  await expect(page.getByRole("heading", { name: "Comprar o Monjarim é fácil." })).toBeVisible();
  await expect(page.getByText(/remarketing/i)).toHaveCount(0);
  await expect(page.locator(".special-offers-grid .offer-card")).toHaveCount(3);
  await page.getByRole("link", { name: "Oferta especial" }).click();
  await expect(page).toHaveURL(/#melhor-opcao$/);

  const wheelPopup = page.getByRole("button", { name: "Clique para escolher seu kit" });
  await wheelPopup.click();
  await expect(page.getByRole("dialog", { name: "Gire e descubra uma opção" })).toBeVisible();
  await page.getByRole("button", { name: "Girar a roleta" }).click();
  await expect(page.getByText(/Sua opção sorteada: kit com/)).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("link", { name: "Continuar com este kit" })).toHaveAttribute("href", /https:\/\/ev\.braip\.com\/ref\?pl=/);
  await page.getByRole("button", { name: "Fechar roleta" }).click();

  const cookieConsent = page.getByRole("button", { name: "Aceitar todos" });
  if (await cookieConsent.isVisible()) await cookieConsent.click();

  const checkoutPopup = context.waitForEvent("page");
  await page.getByRole("link", { name: "Comprar agora" }).first().click();
  const checkout = await checkoutPopup;
  await expect(checkout).toHaveURL(/https:\/\/ev\.braip\.com\/checkout\/plak8rl2\/chew4mj1/);
});
