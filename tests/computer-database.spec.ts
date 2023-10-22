import { test, expect } from "@playwright/test";

test('Открытие страницы компьютерной базы, видим заголовок и список компьютеров', async ({ page }) => {
  await page.goto("http://computer-database.gatling.io/computers");
  await page.getByRole("heading", { name: "574 computers found" }).click();
  await expect(page).toHaveTitle("Computers database");
})

test('Пагинация вперёд', async ({ page }) => {
  await page.goto("http://computer-database.gatling.io/computers");
  await page.getByRole("link", { name: "Next →" }).click();
  await expect(page.getByText("Displaying 11 to 20 of 574")).toHaveText("Displaying 11 to 20 of 574");
});

test('Пагинация назад', async ({ page }) => {
  await page.goto("http://computer-database.gatling.io/computers");
  await page.getByRole("link", { name: "Next →" }).click();
  await page.getByRole("link", { name: '← Previous' }).click();
  await expect(page.getByText("Displaying 1 to 10 of 574")).toHaveText("Displaying 1 to 10 of 574");
});

test('Фильтрация компьютеров по запросу "acer"', async ({ page }) => {
  await page.goto("http://computer-database.gatling.io/computers");
  await page.getByPlaceholder("Filter by computer name...").click();
  await page.getByPlaceholder("Filter by computer name...").fill("acer");
  await page.getByRole("button", { name: "Filter by name" }).click();
  await page.getByRole("cell", { name: "Acer Extensa", exact: true }).click();
  await expect(page.getByRole("cell", { name: "Acer Extensa", exact: true })).toHaveText("Acer Extensa");
});

test('Корректная обработка ситуации, когда запрос не дал результатов', async ({ page }) => {
  await page.goto('https://computer-database.gatling.io/computers');
  await page.getByPlaceholder('Filter by computer name...').click();
  await page.getByPlaceholder('Filter by computer name...').fill('ыыы');
  await page.getByRole('button', { name: 'Filter by name' }).click();
  await expect(page.locator('div').filter({ hasText: 'Nothing to display' })).toHaveText('Nothing to display');
  await expect(page.getByText("Displaying 1 to 0 of 0")).toHaveText("Displaying 1 to 0 of 0");
  /*await expect(page.locator("← Previous" )).toBeDisabled();
  await expect(page.locator("Next →" )).toBeDisabled();*/ 
  //эти две проверки не проходят, подскажите пожалуйста в чем ошибка
});

test('Обязательность поля имя компьютера при попытке фильтрации', async ({ page }) => {
  await page.goto('https://computer-database.gatling.io/computers');
  await page.getByRole('button', { name: 'Filter by name' }).click();
  await expect(page.getByText('Заполните это поле')).toHaveText('Заполните это поле');
}); //этот не проходит, подскажите пожалуйста в чем ошибка

test('Открытие формы создания нового компьютера', async ({ page }) => {
    await page.goto("http://computer-database.gatling.io/computers");
    await page.getByRole('link', { name: 'Add a new computer' }).click();
    await expect(page).toHaveURL("http://computer-database.gatling.io/computers/new");
    await page.getByRole('button', { name: 'Create this computer' }).click();
    await expect(page.getByText('Failed to refine type : Predicate isEmpty() did not fail.')).toContainText('Failed to refine type : Predicate isEmpty() did not fail.');
    await page.getByRole('link', { name: 'Cancel' }).click();
    await expect(page).toHaveURL("http://computer-database.gatling.io/computers");
  });

test('Успешное добавление нового компьютера', async ({ page }) => {
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
  await expect(page.getByText("Done ! Computer acer13 has been created")).toHaveText("Done ! Computer acer13 has been created");
});

test('Просмотр детальной информации по компьютеру', async ({ page }) => {
  await page.goto('https://computer-database.gatling.io/computers');
  await page.getByRole('link', { name: 'ACE' }).click();
  await expect(page.getByText('Edit computer')).toHaveText('Edit computer');
  await expect(page.getByText('Cancel')).toHaveText('Cancel');
});

test('Удаление компьютера', async ({ page }) => {
  await page.goto('https://computer-database.gatling.io/computers');
  await page.getByRole('link', { name: 'ACE' }).click();
  await expect(page.locator('Delete this computer')).toBeDisabled;
  await page.getByRole('button', { name: 'Delete this computer' }).click();
  await expect(page.getByText('Done ! Computer ACE has been deleted')).toHaveText('Done ! Computer ACE has been deleted');
  await expect(page).toHaveURL("https://computer-database.gatling.io/computers");
});

test('Пользователь видит пустую таблицу при переходе по некорректному урлу', async ({ page }) => {
  await page.goto('https://computer-database.gatling.io/computers?p=100');
  await expect(page.locator('div').filter({ hasText: 'Nothing to display' })).toHaveText('Nothing to display');
});