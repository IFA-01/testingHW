/**
 * @jest-environment jsdom
 */

const fs = require('fs');

function initDOM() {
    document.body.innerHTML = fs.readFileSync('./index.html', 'utf-8');
    const scriptContent = fs.readFileSync('./script.js', 'utf-8');
    eval(scriptContent);
    document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true, cancelable: true }));
}

describe('Тесты для скрипта управления параграфами', () => {
    beforeEach(() => {
        initDOM();
    });

    test('Тест 1.Кнопка должна быть скрыта при загрузке страницы', () => {
        // ПОДГОТОВКА - получаем элементы
        const button = document.getElementById('addButton');
        
        // ДЕЙСТВИЕ - страница уже загружена, дополнительных действий не требуется
        
        // ПРОВЕРКА - проверяем начальное состояние
        expect(button.style.display).toBe('none');
    });

    test('Тест 2.Кнопка должна появляться при вводе текста', () => {
        // ПОДГОТОВКА - получаем элементы
        const input = document.getElementById('textInput');
        const button = document.getElementById('addButton');
        
        // ДЕЙСТВИЕ - вводим текст в поле ввода
        input.value = 'Тестовый текст';
        input.dispatchEvent(new window.Event('input'));
        
        // ПРОВЕРКА - проверяем что кнопка стала видимой
        expect(button.style.display).toBe('block');
    });


    test('Тест 3.Кнопка должна скрываться при очистке поля ввода', () => {
        // ПОДГОТОВКА - получаем элементы
        const input = document.getElementById('textInput');
        const button = document.getElementById('addButton');
        
        // ПОДГОТОВКА - сначала делаем кнопку видимой
        input.value = 'Тестовый текст';
        input.dispatchEvent(new window.Event('input'));
        
        // ДЕЙСТВИЕ - очищаем поле ввода
        input.value = '';
        input.dispatchEvent(new window.Event('input'));
        
        // ПРОВЕРКА - проверяем что кнопка скрылась
        expect(button.style.display).toBe('none');
    });

    test('Тест 4.При клике на кнопку должен добавляться новый параграф', () => {
        // ПОДГОТОВКА - получаем элементы и запоминаем начальное состояние
        const input = document.getElementById('textInput');
        const button = document.getElementById('addButton');
        const initialParagraphsCount = document.querySelectorAll('p').length;
        
        // ДЕЙСТВИЕ - вводим текст и кликаем кнопку
        input.value = 'Новый параграф';
        input.dispatchEvent(new window.Event('input'));
        button.click();
        
        // ПРОВЕРКА - проверяем что параграф добавился
        const paragraphs = document.querySelectorAll('p');
        expect(paragraphs.length).toBe(initialParagraphsCount + 1);
        expect(paragraphs[paragraphs.length - 1].textContent).toBe('Новый параграф');
    });

    test('Тест 5.Поле ввода должно очищаться после добавления параграфа', () => {
        // ПОДГОТОВКА - получаем элементы
        const input = document.getElementById('textInput');
        const button = document.getElementById('addButton');
        
        // ДЕЙСТВИЕ - вводим текст и добавляем параграф
        input.value = 'Тестовый текст';
        input.dispatchEvent(new window.Event('input'));
        button.click();
        
        // ПРОВЕРКА - проверяем что поле очистилось
        expect(input.value).toBe('');
    });

    test('Тест 6.Кнопка должна скрываться после добавления параграфа', () => {
        // ПОДГОТОВКА - получаем элементы
        const input = document.getElementById('textInput');
        const button = document.getElementById('addButton');
        
        // ДЕЙСТВИЕ - вводим текст и добавляем параграф
        input.value = 'Тестовый текст';
        input.dispatchEvent(new window.Event('input'));
        button.click();
        
        // ПРОВЕРКА - проверяем что кнопка скрылась
        expect(button.style.display).toBe('none');
    });

    test('Тест 7.Добавление параграфа по нажатию Enter', () => {
        // ПОДГОТОВКА - получаем элементы
        const input = document.getElementById('textInput');
        const initialParagraphsCount = document.querySelectorAll('p').length;
        
        // ДЕЙСТВИЕ - вводим текст и нажимаем Enter
        input.value = 'Текст через Enter';
        input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter' }));
        
        // ПРОВЕРКА - проверяем что параграф добавился
        const paragraphs = document.querySelectorAll('p');
        expect(paragraphs.length).toBe(initialParagraphsCount + 1);
        expect(paragraphs[paragraphs.length - 1].textContent).toBe('Текст через Enter');
    });

    test('Тест 8.Не должен добавляться параграф с пустым текстом', () => {
        // ПОДГОТОВКА - получаем элементы и запоминаем начальное состояние
        const input = document.getElementById('textInput');
        const button = document.getElementById('addButton');
        const initialParagraphsCount = document.querySelectorAll('p').length;
        
        // ДЕЙСТВИЕ - вводим только пробелы и пытаемся добавить
        input.value = '   ';
        input.dispatchEvent(new window.Event('input'));
        button.click();
        
        // ПРОВЕРКА - проверяем что параграф не добавился
        const paragraphs = document.querySelectorAll('p');
        expect(paragraphs.length).toBe(initialParagraphsCount);
    });

    test('Тест 9.Не должно быть больше 5 параграфов', () => {
        // ПОДГОТОВКА - получаем элементы
        const input = document.getElementById('textInput');
        const button = document.getElementById('addButton');
        
        // ДЕЙСТВИЕ - добавляем несколько параграфов (больше лимита)
        for (let i = 0; i < 3; i++) {
            input.value = `Параграф ${i + 4}`;
            input.dispatchEvent(new window.Event('input'));
            button.click();
        }
        
        // ПРОВЕРКА - проверяем что не больше 5 параграфов
        const paragraphs = document.querySelectorAll('p');
        expect(paragraphs.length).toBe(5);
    });

    test('Тест 10.Должны удаляться самые старые параграфы', () => {
        // ПОДГОТОВКА - получаем элементы и запоминаем исходные параграфы
        const input = document.getElementById('textInput');
        const button = document.getElementById('addButton');
        const originalParagraphs = Array.from(document.querySelectorAll('p')).map(p => p.textContent);
        
        // ДЕЙСТВИЕ - добавляем 3 новых параграфа
        for (let i = 0; i < 3; i++) {
            input.value = `Новый ${i + 1}`;
            input.dispatchEvent(new window.Event('input'));
            button.click();
        }
        
        // ПРОВЕРКА - проверяем что старые параграфы удалились, а новые остались
        const currentParagraphs = Array.from(document.querySelectorAll('p')).map(p => p.textContent);
        expect(currentParagraphs).not.toContain(originalParagraphs[0]);
        expect(currentParagraphs).toContain(originalParagraphs[1]);
        expect(currentParagraphs).toContain('Новый 3');
    });

    test('Тест 11.Фокус должен оставаться на поле ввода после добавления', () => {
        // ПОДГОТОВКА - получаем элементы
        const input = document.getElementById('textInput');
        const button = document.getElementById('addButton');
        
        // ДЕЙСТВИЕ - фокусируем поле, вводим текст и добавляем параграф
        input.focus();
        input.value = 'Тестовый текст';
        input.dispatchEvent(new window.Event('input'));
        button.click();
        
        // ПРОВЕРКА - проверяем что фокус остался на поле ввода
        expect(document.activeElement).toBe(input);
    });

    test('Тест 12.Должны обрезаться пробелы в начале и конце', () => {
        // ПОДГОТОВКА - получаем элементы
        const input = document.getElementById('textInput');
        const button = document.getElementById('addButton');
        
        // ДЕЙСТВИЕ - вводим текст с пробелами и добавляем параграф
        input.value = '   текст с пробелами   ';
        input.dispatchEvent(new window.Event('input'));
        button.click();
        
        // ПРОВЕРКА - проверяем что пробелы обрезались
        const paragraphs = document.querySelectorAll('p');
        expect(paragraphs[paragraphs.length - 1].textContent).toBe('текст с пробелами');
    });

    test('Тест 13.Корректная работа при множественном добавлении', () => {
        // ПОДГОТОВКА - получаем элементы
        const input = document.getElementById('textInput');
        const button = document.getElementById('addButton');
        const testTexts = ['Первый', 'Второй', 'Третий', 'Четвертый', 'Пятый'];
        
        // ДЕЙСТВИЕ - добавляем несколько параграфов
        testTexts.forEach(text => {
            input.value = text;
            input.dispatchEvent(new window.Event('input'));
            button.click();
        });
        
        // ПРОВЕРКА - проверяем общее количество и содержание
        const paragraphs = document.querySelectorAll('p');
        expect(paragraphs.length).toBe(5);
        
        const paragraphTexts = Array.from(paragraphs).map(p => p.textContent);
        expect(paragraphTexts).toEqual(expect.arrayContaining(['Третий', 'Четвертый', 'Пятый']));
    });

    test('Тест 14.Новые параграфы должны иметь правильную структуру', () => {
        // ПОДГОТОВКА - получаем элементы
        const input = document.getElementById('textInput');
        const button = document.getElementById('addButton');
        
        // ДЕЙСТВИЕ - добавляем новый параграф
        input.value = 'Тестовый параграф';
        input.dispatchEvent(new window.Event('input'));
        button.click();
        
        // ПРОВЕРКА - проверяем структуру созданного элемента
        const newParagraph = document.querySelectorAll('p')[document.querySelectorAll('p').length - 1];
        expect(newParagraph.tagName).toBe('P');
        expect(newParagraph.textContent).toBe('Тестовый параграф');
    });

    test('Тест 15.Полный сценарий работы', () => {
        // ПОДГОТОВКА - получаем элементы
        const input = document.getElementById('textInput');
        const button = document.getElementById('addButton');
        
        // ПРОВЕРКА 1 - начальное состояние
        expect(button.style.display).toBe('none');
        
        // ДЕЙСТВИЕ 1 - вводим первый текст
        input.value = 'Текст 1';
        input.dispatchEvent(new window.Event('input'));
        
        // ПРОВЕРКА 2 - кнопка появилась
        expect(button.style.display).toBe('block');
        
        // ДЕЙСТВИЕ 2 - добавляем параграф
        button.click();
        
        // ДЕЙСТВИЕ 3 - добавляем еще параграфы
        for (let i = 0; i < 4; i++) {
            input.value = `Текст ${i + 2}`;
            input.dispatchEvent(new window.Event('input'));
            button.click();
        }
        
        // ПРОВЕРКА 4 - проверяем ограничение количества
        expect(document.querySelectorAll('p').length).toBe(5);
    });
});