import { expect, test } from "@playwright/test";

test("navegacao e oferta especial levam ao checkout Braip", async ({ page, context }) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(navigation.getByRole("link", { name: "O produto" })).toBeVisible();
  await navigation.getByRole("link", { name: "O produto" }).click();
  await expect(page).toHaveURL(/#produto$/);
  await expect(page.getByRole("heading", { name: "Comprar o MONJARIM é fácil." })).toBeVisible();
  await expect(page.locator(".testimonial-avatar")).toHaveCount(4);
  await expect(page.locator(".testimonial-avatar").first()).toHaveCSS("background-image", /depoimentos-referencia\.png/);
  await page.getByRole("link", { name: "Oferta especial" }).click();
  await expect(page).toHaveURL(/#melhor-opcao$/);

  const cookieConsent = page.getByRole("button", { name: "Aceitar todos" });
  if (await cookieConsent.isVisible()) await cookieConsent.click();

  const checkoutPopup = context.waitForEvent("page");
  await page.getByRole("link", { name: "Comprar agora" }).first().click();
  const checkout = await checkoutPopup;
  await expect(checkout).toHaveURL(/https:\/\/ev\.braip\.com\/checkout\/plak8rl2\/chew4mj1/);
});
