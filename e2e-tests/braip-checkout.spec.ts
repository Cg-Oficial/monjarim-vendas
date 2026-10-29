import { expect, test } from "@playwright/test";

test("botao de oferta especial leva ao plano e ao checkout Braip", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Comprar o MONJARIM é fácil." })).toBeVisible();
  await page.getByRole("link", { name: "Oferta especial" }).click();
  await expect(page).toHaveURL(/#melhor-opcao$/);

  const cookieConsent = page.getByRole("button", { name: "Aceitar todos" });
  if (await cookieConsent.isVisible()) await cookieConsent.click();

  const checkoutPopup = context.waitForEvent("page");
  await page.getByRole("link", { name: "Comprar agora" }).first().click();
  const checkout = await checkoutPopup;
  await expect(checkout).toHaveURL(/https:\/\/ev\.braip\.com\/checkout\/plak8rl2\/chew4mj1/);
});
