import { test, expect } from "@playwright/test";

test("Открытие страницы компьютерной базы", async ({ page }) => {
  await page.goto("http://computer-database.gatling.io/computers");
  await page.getByRole("heading", { name: "574 computers found" }).click();
    expect(page).toHaveTitle("574 computers found")
});

test('Фильтрация компьютеров по запросу "acer"', async ({ page }) => {
  await page.goto("http://computer-database.gatling.io/computers");
  await page.getByPlaceholder("Filter by computer name...").click();
  await page.getByPlaceholder("Filter by computer name...").fill("acer");
  await page.getByRole("button", { name: "Filter by name" }).click();
  await page.getByRole("cell", { name: "Acer Extensa", exact: true }).click();
    expect(page.getByRole("cell", { name: "Acer Extensa", exact: true })).toHaveText("Acer Extensa");
});

test("Открытие формы создания нового компьютера", async ({ page }) => {
    await page.goto("http://computer-database.gatling.io/computers");
    await page.getByRole('link', { name: 'Add a new computer' }).click();
        expect(page).toHaveURL("http://computer-database.gatling.io/computers/new");
    await page.getByRole('button', { name: 'Create this computer' }).click();
        expect(page.getByText('Failed to refine type : Predicate isEmpty() did not fail.')).toContainText('Failed to refine type : Predicate isEmpty() did not fail.');
    await page.getByRole('link', { name: 'Cancel' }).click();
        expect(page).toHaveURL("http://computer-database.gatling.io/computers/new");
  });

test("Успешное добавление нового компьютера", async ({ page }) => {
  await page.goto("http://computer-database.gatling.io/computers");
  await page.getByRole("link", { name: "Add a new computer" }).click();
  await page.getByLabel("Computer name").click();
  await page.getByLabel("Computer name").fill("acer13");
  await page.getByLabel("Introduced").click();
  await page.getByLabel("Introduced").fill("1999-01-01");
  await page.getByLabel("Discontinued").click();
  await page.getByLabel("Discontinued").fill("2000-01-01");
  await page.getByLabel("Company").selectOption("36");
  await page.getByRole("button", { name: "Create this computer" }).click();
  await page.getByText("Done ! Computer acer13 has been created").click();
    expect(page.getByText("Done ! Computer acer13 has been created")).toHaveText("Done ! Computer acer13 has been created")
});

test("Переключение таблицы на вторую страницу", async ({ page }) => {
  await page.goto("http://computer-database.gatling.io/computers");
  await page.getByRole("link", { name: "Next →" }).click();
  await page.getByText("Displaying 11 to 20 of 574").click();
    expect(page.getByText("Displaying 11 to 20 of 574")).toHaveValue("Displaying 11 to 20 of 574")
    expect(page.getByRole("link", { name: '← Previous' })).toBeEmpty()
});