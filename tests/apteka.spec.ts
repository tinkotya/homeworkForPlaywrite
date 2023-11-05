import { test, expect } from '@playwright/test';

const config = {
  baseURL: 'https://zdravcity.ru/',
  urlOfLek: 'https://zdravcity.ru/p_zolotaja-zvezda-balzam-zhidkij-5ml-0010469.html',
  heading: "//span[@title='Золотая звезда бальзам для наружного применения жидкий 5мл']",
  inputName: 'Введите название лекарства',
  nameOfLek: 'золотая звезда',
  buttonPlus: '(//button[@aria-label="Увеличить на один. Текущее количество 1"])[2]',
  buttonBuy: '//*[text()="Купить"]',
  buttonGoToCart: '//*[text()="Перейти в корзину"]',
  buttonCount: '//*[text()="Задать количество"]',
};
export default config;

test('Заголовок товара соответствует искомому', async ({ page }) => {
  await page.goto(config.baseURL);
  await page.getByPlaceholder(config.inputName).click();
  await page.getByPlaceholder(config.inputName).fill(config.nameOfLek);
  await expect(page.getByRole('heading', { name: config.heading, exact: true })).toHaveText("Золотая звезда бальзам для наружного применения жидкий 5мл");
});

test('Работает кнопка +1 товар', async ({ page }) => {
  await page.goto(config.urlOfLek);
  await page.getByLabel(config.buttonPlus).click();
  await expect(page.getByRole('spinbutton', { name: config.buttonCount })).toHaveText(2);
});

test('При нажатии на кнопку "Купить" она превращается в "Перейти в корзину"', async ({ page }) => {
  await page.goto('https://zdravcity.ru/p_zolotaja-zvezda-balzam-zhidkij-5ml-0010469.html');
  await page.getByText('Купитьот 259 ₽').click();
  await expect(page.getByRole('button', { name: config.buttonGoToCart })).toHaveText("Перейти в корзину");
});

test('При нажатии на "Выбрать аптеку" появляется окно Авторизации', async ({ page }) => {
  await page.goto('https://zdravcity.ru/cart/');
  await page.getByRole('button', { name: 'Выбрать аптеку' }).click();
  await expect(page.getByRole('heading', { name: 'Авторизация' })).toHaveText("Авторизация");
});

test('При нажатии на кнопку "Очистить корзину" появляется окно с подтверждением', async ({ page }) => {
  await page.goto('https://zdravcity.ru/cart/');
  await page.getByRole('button', { name: 'Выбрать аптеку' }).click();
  await page.getByRole('heading', { name: 'Авторизация' }).click();
  await page.getByLabel('Закрыть').click();
  await page.getByRole('button', { name: 'Очистить корзину' }).click();
  await expect(page.getByText('Хотите очистить корзину?')).toHaveText("Хотите очистить корзину?");
});