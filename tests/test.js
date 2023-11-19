/// <reference types='codeceptjs' />
const config = require('../framework/config/config.js')
const expect = require('chai').expect;

Feature('Главная страница');

Before(({ mainPage }) => {
    mainPage.visit()
})

Scenario('При переходе на главную отражается корректный адрес',  async ({ I }) => {
    I.SeeCurrentUrlEquals('https://zdravcity.ru')
});

Scenario('При клике на "Акции" открывается страница дискаунтов',  async ({ I }) => {
    I.click(config.butDiscount)
    I.SeeCurrentUrlEquals('https://zdravcity.ru/discounts/')
});

Scenario('В поле поиска вводятся и отображаются символы',  async ({ I }) => {
    I.fillField(config.inputSearch, 'золотая звезда')
    I.seeInField(config.inputSearch, 'золотая звезда')
});

Scenario('Поле поиска очищается',  async ({ I }) => {
    I.fillField(config.inputSearch, 'золотая звезда')
    I.clearField(config.inputSearch)
    I.dontSeeInField(config.inputSearch, 'золотая звезда')
});

Scenario('Клик на бургер-меню открывает меню "Каталог товаров", закрывающее поиск',  async ({ I }) => {
    I.click(config.butMenu)
    I.seeInTitle("Каталог товаров")
    I.dontSeeElementInDOM(config.inputSearch)
});