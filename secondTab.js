'use strict'

const countryInput = document.querySelector('#country-select');
const yearInput = document.querySelector('#year-select');
const getHolidaysButton = document.querySelector('.button');

const API_KEY = 'AP0JuotKTwKywKGB42ZxIG1HuVKQq25s';
const currentYear = new Date().getFullYear();

for (let year = 2001; year <= 2049; year++) {
    const option = document.createElement('option');
    option.value = year.toString(); // без перетворення в "рядок" редактор коду підкреслює помилкою, проте все працює. Тож використав перетворення в рядок і також все працює.
    option.textContent = year.toString(); // без перетворення в "рядок" редактор коду підкреслює помилкою, проте все працює. Тож використав перетворення в рядок і також все працює.
    if (year === currentYear) {
        option.selected = true;
    }
    yearInput.appendChild(option);
}