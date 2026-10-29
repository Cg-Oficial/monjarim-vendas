import { expect, test } from "@playwright/test";

test("pagina de ofertas direciona ao checkout Braip do plano selecionado", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Escolha sua opção Monjarim." })).toBeVisible();

  const cookieConsent = page.getByRole("button", { name: "Aceitar todos" });
  if (await cookieConsent.isVisible()) await cookieConsent.click();

  const checkoutPopup = context.waitForEvent("page");
  await page.getByRole("link", { name: "Comprar agora" }).first().click();
  const checkout = await checkoutPopup;
  await expect(checkout).toHaveURL(/https:\/\/ev\.braip\.com\/ref\?pl=plak8rl2/);
});
