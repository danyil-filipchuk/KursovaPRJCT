'use strict'

document.addEventListener('DOMContentLoaded', () => {

    const API_KEY = 'AP0JuotKTwKywKGB42ZxIG1HuVKQq25s';
    const countryInput = document.querySelector('#country-select');
    const yearInput = document.querySelector('#year-select');
    const errorSpace = document.querySelector('#error-space');

    // Цикл додавання різних років в другий інпут
    for (let year = 2001; year <= 2049; year++) {
        const currentYear = new Date().getFullYear(); // Отримання поточного року
        const option = document.createElement('option');

        // Без перетворення в "рядок" редактор коду підкреслює помилкою, проте все працює. Тож використав перетворення в рядок і також все працює.
        option.value = year.toString();
        option.textContent = year.toString();

        if (year === currentYear) {
            option.selected = true; // Якщо рік в циклі потрапляє на поточний рік, то робимо його базовим на сторінці
        }
        yearInput.appendChild(option);
    }

    // Отримання списку країн через API
    fetch(`https://calendarific.com/api/v2/countries?api_key=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load countries'); // Помилка, якщо відповідь не успішна
            }
            return response.json(); // Перетворюємо відповідь у JSON
        })
        .then(data => {
            console.log(data)
            const countries = data.response.countries; // Отримуємо список країн
            countries.forEach(country => {
                const option = document.createElement('option'); // Створюємо елемент option
                option.value = country['iso-3166']; // Встановлюємо значення option як код країни (думаю, що можна було б ще UUID, але там довге число
                option.textContent = country.country_name; // Відображаємо назву країни
                countryInput.appendChild(option); // Додаємо країну у випадаючий список
            })

            // Лісенер, який активує вибір року після вибору країни
            countryInput.addEventListener('change', () => {
                yearInput.disabled = false;
            })
        })
        .catch(error => {
            showError('Failed to load countries: ' + error.message); // Помилка, якщо не вдалося отримати список країн
        });

    // Функція про відображення помилки
    function showError(message) {
        errorSpace.innerHTML = `<p>${message}</p>`;
        errorSpace.classList.remove('hidden-error');
        errorSpace.classList.add('visible-error');
    }

    // Функція очищення помилки (щоб вона зникала, якщо наступний запит успішний)
    function clearError() {
        errorSpace.classList.remove('visible-error');
        errorSpace.classList.add('hidden-error');
    }

    // Функція з fetch, вивів її окремо разом, також передаються параметри - країна та рік
    function tableFetchRequest(country, year) {

        fetch(`https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${country}&year=${year}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load holidays'); // Помилка, якщо відповідь не успішна
                }
                return response.json(); // Перетворюємо відповідь у JSON
            })
            .then(data => {
                const tableResults = document.querySelector('#results-table tbody');
                const tableHead = document.querySelector('#output-space');

                tableResults.innerHTML = ''; // Очищаємо попередні результати перед вставкою нових

                // Ці рядки додав всередину then, щоб не було затримки між з'явленням заголовка таблиці та її змістом.
                tableHead.classList.remove('hidden-table');
                tableHead.classList.add('visible-table');

                const holidays = data.response.holidays; // Отримуємо список свят
                holidays.forEach(holiday => {
                    const row = document.createElement('tr'); // Створення нового рядка

                    // Створення нової "комірки" та присвоєння їй значення. Довго грався форматом виведення та зупинився на такому
                    const dateInfo = document.createElement('td');
                    dateInfo.textContent = new Date(holiday.date.iso).toLocaleDateString('en', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    // Створення нової "комірки" та присвоєння їй значення
                    const holidayInfo = document.createElement('td');
                    holidayInfo.textContent = holiday.name;

                    // Довго думав як вірно зробити ідентифікацію, для сортування у майбутньому. То створив атрибут data-date, такий саме спосіб як раніше робили в ДЗ data-id.
                    row.setAttribute('data-date', holiday.date.iso);
                    row.append(dateInfo, holidayInfo); // Додавання "комірок" до рядка
                    tableResults.appendChild(row); // Додавання рядка до HTMl елементу
                })
            })
            .catch(error => {
                // На етапі тестування побачив баг, що разом із текстом помилки (у разі її наявності) з'являється і заголовок таблиці пустий без результатів, тому додав нові умови.
                const tableHead = document.querySelector('#output-space');
                tableHead.classList.remove('visible-table') // Забираємо клас видимості
                tableHead.classList.add('hidden-table'); // Додаємо клас приховування
                // Виводимо повідомлення про помилку
                showError('Failed to load holidays: ' + error.message);
            });
    }

    // Лісенер кнопки отримання свят - одразу від селектора без створення зайвої змінної
    document.querySelector('.main-button').addEventListener('click', () => {
        const countrySelect = countryInput.value; // Отримуємо значення країни
        const yearSelect = yearInput.value; // Отримуємо значення року

        if (!countrySelect || !yearSelect) {
            showError('Please select country and year'); // Виводимо помилку, якщо не обрано значення
            return;
        } else {
            clearError(); // Очищаємо помилки, якщо введені дані коректні
        }
        // Викликаємо функцію з fetch, аргументами слугують - значення країни та рік
        tableFetchRequest(countrySelect, yearSelect)
    })

    // Лісенер кнопки сортування - одразу від селектора без створення зайвої змінної
    document.querySelector('.sort-button').addEventListener('click', () => {
        // Отримаємо результати таблиці, які були створені раніше в функції tableFetchRequest
        const tableResults = document.querySelector('#results-table tbody');
        // На основі отриманих результатів таблиці звертаємось до всіх 'tr' рядків (тобто дата і назва свята) та обгортаємо їх масивом
        const rows = Array.from(tableResults.querySelectorAll('tr'));

        // Відповідним методом робимо сортування
        rows.sort((a,b) => {
            // Перетворюємо значення атрибуту на дату та присвоюємо до елементу над яким працюємо
            const firstAttribute = new Date (a.getAttribute('data-date'));
            const secondAttribute = new Date(b.getAttribute('data-date'));

            // Логічна конструкція, змінити на тернарну перевірку ? :)
            if (secondAttribute < firstAttribute) {
                return secondAttribute - firstAttribute;
            } else {
                return firstAttribute - secondAttribute;
            }
        })
        // Оновлюємо дані в таблиці, щоб все вірно виглядало
        rows.forEach(row => tableResults.appendChild(row));
    })
});
