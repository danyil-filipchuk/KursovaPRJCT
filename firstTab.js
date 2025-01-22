'use strict'

document.addEventListener('DOMContentLoaded', createTableVisibility);

const start = document.querySelector('#start-date');
const end = document.querySelector('#end-date');
const preset = document.querySelector('#preset');
const typeDays = document.querySelector('#day-options');
const optionDate = document.querySelector('#calculate-options');
const buttonCalculate = document.querySelector('.button');
const outputResult = document.querySelector('#result');

start.addEventListener('change', () => {
    end.disabled = false;
    end.min = start.value;
})

preset.addEventListener('change', () => {
    const startDate = new Date(start.value);
    let changedDate;

    if (!start.value) {
        outputResult.textContent = 'Please select start date';
        return;
    }

    if (preset.value === 'week') {
        changedDate = new Date(startDate.setDate(startDate.getDate() + 7));
    }
    else if (preset.value === 'month') {
        changedDate = new Date(startDate.setDate(startDate.getDate() + 30));
    }

    if (changedDate) {
        end.value = changedDate.toISOString().split('T')[0];
    }
})

buttonCalculate.addEventListener('click', () => {

    if (!start.value || !end.value) {
        outputResult.textContent = 'Please select both dates'
        return;
    }

    let sumOfDays = 0;
    let startDate = new Date(start.value);
    const endDate = new Date(end.value);


    while (startDate < endDate) {
        const dayOfWeek = startDate.getDay();

        if (typeDays.value === 'all') {
            sumOfDays++;
        } else if ((typeDays.value === 'weekdays') && (dayOfWeek >= 1 && dayOfWeek <= 5)) {
            sumOfDays++;
        } else if ((typeDays.value === 'weekends') && (dayOfWeek === 0 || dayOfWeek === 6)) {
            sumOfDays++;
        }
        startDate.setDate(startDate.getDate() + 1);
    }

    let calculation;
    const hours = 24;
    const minutes = 24 * 60;
    const seconds = 24 * 60 * 60;

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

    outputResult.textContent = `Result: ${calculation}`

    storeResultsInLocalStorage(start.value, end.value, calculation);
    createTableVisibility();
})

function storeResultsInLocalStorage(start, end, result) {
    const results = localStorage.getItem('results') !== null
        ? JSON.parse(localStorage.getItem('results')) : [];

    results.push({start,end,result});

    if (results.length > 10) {
        results.shift();
    }

    localStorage.setItem('results', JSON.stringify(results));
}

function createTableVisibility() {
    const results = localStorage.getItem('results') !== null
        ? JSON.parse(localStorage.getItem('results')) : [];

    const tableResults = document.querySelector('#tableResults');
    tableResults.innerHTML = '';

    results.forEach(({start, end, result}) => {
        const row = document.createElement('tr');

        const startDateInfo = document.createElement('td');
        startDateInfo.textContent = new Date(start).toLocaleDateString('en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const endDateInfo = document.createElement('td');
        endDateInfo.textContent = new Date(end).toLocaleDateString('en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const resultInfo = document.createElement('td');
        resultInfo.textContent = result;

        row.appendChild(startDateInfo);
        row.appendChild(endDateInfo);
        row.appendChild(resultInfo);
        tableResults.appendChild(row);
    })
}