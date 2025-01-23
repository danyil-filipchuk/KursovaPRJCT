'use strict'

// Виклик функції для завантаження таблиці результатів при завантаженні сторінки:
document.addEventListener('DOMContentLoaded', createTableVisibility);

// Селектори на HTML елементи:
const start = document.querySelector('#start-date');
const end = document.querySelector('#end-date');
const preset = document.querySelector('#preset');
const typeDays = document.querySelector('#day-options');
const optionDate = document.querySelector('#calculate-options');
const buttonCalculate = document.querySelector('.button');
const outputResult = document.querySelector('#result');

// Лісенер зміни першої дати, "відкриває" вибір другої дати та встановлює її мінімальне значення:
start.addEventListener('change', () => {
    end.disabled = false;
    end.min = start.value;
})

// Лісенер вибору пресету:
preset.addEventListener('change', () => {
    const startDate = new Date(start.value);
    let changedDate;

    // Якщо перша дата не вибрана:
    if (!start.value) {
        outputResult.textContent = 'Please select start date';
        return;
    }

    if (preset.value === 'week') { // Додає 7 днів при умові вибору відповідного пресету
        changedDate = new Date(startDate.setDate(startDate.getDate() + 7));
    }
    else if (preset.value === 'month') { // Додає 30 днів при умові вибору відповідного пресету
        changedDate = new Date(startDate.setDate(startDate.getDate() + 30));
    }

    // Якщо пресет вибраний та відповідна змінна має якесь значення, то оновлюємо значення другої дати з відповідним форматуванням.
    // Знайшов такий варіант форматування для вірного "занесення" в інпут-календар.
    if (changedDate) {
        end.value = changedDate.toISOString().split('T')[0];
    }
})

// Лісенер кнопки прорахунку:
buttonCalculate.addEventListener('click', () => {

    // Якщо одна з дат не вибрана:
    if (!start.value || !end.value) {
        outputResult.textContent = 'Please select both dates'
        return;
    }

    let sumOfDays = 0; // Змінна\лічильник для нарахування днів
    let startDate = new Date(start.value);
    const endDate = new Date(end.value);

    // Цикл для прорахунку днів днів:
    while (startDate < endDate) { // Умова циклу
        const dayOfWeek = startDate.getDay(); // Отримання індексу дня (від 0 до 6)

        if (typeDays.value === 'all') { // Всі дні:
            sumOfDays++;
        } else if ((typeDays.value === 'weekdays') && (dayOfWeek >= 1 && dayOfWeek <= 5)) { // Тільки будні дні:
            sumOfDays++;
        } else if ((typeDays.value === 'weekends') && (dayOfWeek === 0 || dayOfWeek === 6)) { // Тільки вихідні дні:
            sumOfDays++;
        }
        // Після першого "проходу" переключаємо на наступний день до тих пір, поки не дійдемо до умови:
        startDate.setDate(startDate.getDate() + 1);
    }

    let calculation; // Змінна для збереження прорахунку
    const hours = 24; // Кількість годин в одному дні
    const minutes = 24 * 60; // Кількість хвилин в одному дні
    const seconds = 24 * 60 * 60; // Кількість секунд в одному дні

    // Прорахунок згідно з вибраного варіанту:
    if (optionDate.value === 'seconds') {
        calculation = (sumOfDays * seconds) + ' seconds';
    }
    if (optionDate.value === 'minutes') {
        calculation = (sumOfDays * minutes) + ' minutes';
    }
    if (optionDate.value === 'hours') {
        calculation = (sumOfDays * hours) + ' hours';
    }
    if (optionDate.value === 'days') {
        calculation = sumOfDays + ' days';
    }

    // Виведення результату на сторінку:
    outputResult.textContent = `Result: ${calculation}`

    // Зберігаємо результати в наш localStorage для виведення в таблицю:
    storeResultsInLocalStorage(start.value, end.value, calculation);
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

    // Умова перевірки кількості результатів, якщо більше 10 - то видаляється найстаріший:
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

        row.appendChild(startDateInfo); // Додавання "комірки" до рядку
        row.appendChild(endDateInfo); // Додавання "комірки" до рядку
        row.appendChild(resultInfo); // Додавання "комірки" до рядку
        tableResults.appendChild(row); // Додавання рядку до HTMl елементу
    })
}