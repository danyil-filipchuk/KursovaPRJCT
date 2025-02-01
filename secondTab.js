'use strict'

const API_KEY = 'AP0JuotKTwKywKGB42ZxIG1HuVKQq25s';
const countryInput = document.querySelector('#country-select');
const yearInput = document.querySelector('#year-select');
const errorSpace = document.querySelector('#error-space');

const currentYear = new Date().getFullYear();

for (let year = 2001; year <= 2049; year++) {
    const option = document.createElement('option');
    option.value = year.toString(); // Без перетворення в "рядок" редактор коду підкреслює помилкою, проте все працює. Тож використав перетворення в рядок і також все працює.
    option.textContent = year.toString(); // Без перетворення в "рядок" редактор коду підкреслює помилкою, проте все працює. Тож використав перетворення в рядок і також все працює.
    if (year === currentYear) {
        option.selected = true;
    }
    yearInput.appendChild(option);
}

function showError(message) {
    errorSpace.innerHTML = `<p>${message}</p>`;
    errorSpace.classList.remove('hidden-error');
    errorSpace.classList.add('visible-error');
}

function clearError () {
    errorSpace.classList.remove('visible-error');
    errorSpace.classList.add('hidden-error');
}

fetch(`https://calendarific.com/api/v2/countries?api_key=${API_KEY}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error fetching countries');
        }
        return response.json();
    })
    .then(data => {
        const countries = data.response.countries;
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country['iso-3166'];
            option.textContent = country.country_name;
            countryInput.appendChild(option);
        })

        countryInput.addEventListener('change', () => {
            yearInput.disabled = false;
        })

    })

document.querySelector('.button').addEventListener('click', () => {
    const countrySelect = countryInput.value;
    const yearSelect = yearInput.value;
    const tableResults = document.querySelector('#results-table tbody');

    if (!countrySelect || !yearSelect) {
        showError('Please select country and year');
        return;
    } else {
        clearError();
    }

    fetch(`https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${countrySelect}&year=${yearSelect}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching holidays');
            }
            return response.json();
        })
        .then(data => {
            const tableHead = document.querySelector('#table-head');
            tableHead.classList.remove('hidden-table'); // Цей рядок додав всередину then, щоб не було затримки між з'явленням заголовка таблиці та її змістом.
            tableHead.classList.add('visible-table'); // Цей рядок додав всередину then, щоб не було затримки між з'явленням заголовка таблиці та її змістом.

            tableResults.innerHTML = '';

            const holidays = data.response.holidays;
            holidays.forEach(holiday => {
                const row = document.createElement('tr');

                const dateInfo = document.createElement('td');
                dateInfo.textContent = new Date(holiday.date.iso).toLocaleDateString('en', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const holidayInfo = document.createElement('td');
                holidayInfo.textContent = holiday.name;

                row.append(dateInfo, holidayInfo);
                tableResults.appendChild(row);
            })
        })
})