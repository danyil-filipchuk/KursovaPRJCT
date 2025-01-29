'use strict'

// Виклик функції для завантаження таблиці результатів при завантаженні сторінки:
document.addEventListener('DOMContentLoaded', createTableVisibility);

// Селектори на HTML елементи:
const firstDate = document.querySelector('#start-date');
const secondDate = document.querySelector('#end-date');
const presetType = document.querySelector('#preset');
const calculateButton = document.querySelector('.button');
const outputResult = document.querySelector('#result');

// Лісенер зміни першої дати, "відкриває" вибір другої дати та встановлює її мінімальне значення:
firstDate.addEventListener('change', () => {
    secondDate.disabled = false;
    secondDate.min = firstDate.value;
})

// Лісенер вибору пресету:
presetType.addEventListener('change', () => {
    const startDate = new Date(firstDate.value);

    // Якщо перша дата не вибрана:
    if (!firstDate.value) {
        outputResult.textContent = 'Please select first date';
        return;
    }

    if (presetType.value === 'week') { // Додає 7 днів при умові вибору відповідного пресету
        startDate.setDate(startDate.getDate() + 7);
        secondDate.value = startDate.toISOString().split('T')[0];
    }
    if (presetType.value === 'month') { // Додає 30 днів при умові вибору відповідного пресету
        startDate.setDate(startDate.getDate() + 30);
        secondDate.value = startDate.toISOString().split('T')[0];
    }
})

// Нова функція, ці дії раніше були в Лісенері кнопки, виніс окремо та на всяк випадок з аргументами та параметрами.
function calculateDayType (firstDateValue, secondDateValue) {
    let sumOfDays = 0; // Змінна\лічильник для нарахування днів
    let startDate = new Date(firstDateValue);
    const endDate = new Date(secondDateValue);

    // Отримання селектору на HTML елемент, локально в цьому Лісенері
    const dayType = document.querySelector('#day-options');

    // Цикл для прорахунку днів:
    while (startDate < endDate) { // Умова циклу
        const dayOfWeek = startDate.getDay(); // Отримання індексу дня (від 0 до 6)

        if (dayType.value === 'all') { // Всі дні:
            sumOfDays++;
        } else if ((dayType.value === 'weekdays') && (dayOfWeek >= 1 && dayOfWeek <= 5)) { // Тільки будні дні:
            sumOfDays++;
        } else if ((dayType.value === 'weekends') && (dayOfWeek === 0 || dayOfWeek === 6)) { // Тільки вихідні дні:
            sumOfDays++;
        }
        // Після першого "проходу" перемикаємо на наступний день до тих пір, поки не дійдемо до умови:
        startDate.setDate(startDate.getDate() + 1);
    }
    return sumOfDays; // повернення актуального результату змінної для того, щоб було можливо коректно отримувати результат функції в місці виклику
}

// Нова функція, як Ви порекомендували. Вирішив її вивести ззовні та окремо (можливо Ви так і мали на увазі). Класний спосіб, правда сидів певний час в нього вникав.
function calculateResult (unit, sumOfDays) {
    const hours = 24;
    const minutes = 24 * 60;
    const seconds = 24 * 60 * 60;

    const unitToValueMapping = {
        seconds: (sumOfDays * seconds) + ' seconds',
        minutes: (sumOfDays * minutes) + ' minutes',
        hours: (sumOfDays * hours) + ' hours',
        days: sumOfDays + ' days'
    }
    return unitToValueMapping[unit];
}

// Лісенер кнопки прорахунку:
calculateButton.addEventListener('click', () => {

    // Якщо одна з дат не вибрана:
    if (!firstDate.value || !secondDate.value) {
        outputResult.textContent = 'Please select both dates'
        return;
    }

    // Отримання селектору на HTML елемент, локально в цьому Лісенері
    const rangeSelectionType = document.querySelector('#calculate-options').value;

    const calculation = calculateResult(rangeSelectionType, calculateDayType(firstDate.value, secondDate.value));

    // Виведення результату на сторінку:
    outputResult.textContent = `Result: ${calculation}`

    // Зберігаємо результати в наш localStorage для виведення в таблицю:
    storeResultsInLocalStorage(firstDate.value, secondDate.value, calculation);

    // Оновлюємо дані в таблиці:
    createTableVisibility();
})

// Функція збереження результатів в localStorage:
function storeResultsInLocalStorage(start, end, result) {

    // Початкова перевірка запозичена з нашого воркшопу:)
    const results = localStorage.getItem('results') !== null
        ? JSON.parse(localStorage.getItem('results')) : [];

    // При кожному виклику функції додаємо нові результати (ті що передали в аргументи):
    results.push({start,end,result});

    // Умова перевірки кількості результатів, якщо понад 10 - то видаляється найстаріший:
    if (results.length > 10) {
        results.shift();
    }

    // Збереження ключа та значення:
    localStorage.setItem('results', JSON.stringify(results));
}

// Функція оновлення таблиці та додавання інформації:
function createTableVisibility() {

    // Початкова перевірка запозичена з нашого воркшопу:)
    const results = localStorage.getItem('results') !== null
        ? JSON.parse(localStorage.getItem('results')) : [];

    // Селектор на HTMl елемент:
    const tableResults = document.querySelector('#tableResults');
    tableResults.innerHTML = '';

    // Метод для роботи з кожним елементом нашого масиву:
    results.forEach(({start, end, result}) => {
        // Створення нового рядка:
        const row = document.createElement('tr');

        // Створення нової "комірки" та присвоєння їй значення. Довго грався форматом виведення та зупинився на такому:
        const startDateInfo = document.createElement('td');
        startDateInfo.textContent = new Date(start).toLocaleDateString('en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Створення нової "комірки" та присвоєння їй значення. Довго грався форматом виведення та зупинився на такому:
        const endDateInfo = document.createElement('td');
        endDateInfo.textContent = new Date(end).toLocaleDateString('en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Створення нової "комірки" та присвоєння їй значення.
        const resultInfo = document.createElement('td');
        resultInfo.textContent = result;

        row.appendChild(startDateInfo); // Додавання "комірки" до рядка
        row.appendChild(endDateInfo); // Додавання "комірки" до рядка
        row.appendChild(resultInfo); // Додавання "комірки" до рядка
        tableResults.appendChild(row); // Додавання рядка до HTMl елементу
    })
}