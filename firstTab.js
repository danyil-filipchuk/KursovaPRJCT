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

    const startDate = new Date(start.value);
    const endDate = new Date(end.value);
    const difference = endDate - startDate;

    let copyStartDate = new Date(startDate);
    let sumOfDays = 0;
    let selectedDays = typeDays.value;

    while (copyStartDate <= endDate) {
        const dayOfWeek = copyStartDate.getDay();

        if (selectedDays === 'all' ||
            (selectedDays === 'weekdays' && dayOfWeek >= 1 && dayOfWeek <= 5) ||
            (selectedDays === 'weekends' && (dayOfWeek === 0 || dayOfWeek === 6))) {
            sumOfDays++;
        }
        copyStartDate.setDate(copyStartDate.getDate() + 1);
    }

    const seconds = 24 * 60 * 60;
    const minutes = 24 * 60;
    const hours = 24;

    let calculation;

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

        const startDateCell = document.createElement('td');
        startDateCell.textContent = new Date(start).toLocaleDateString('en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const endDateCell = document.createElement('td');
        endDateCell.textContent = new Date(end).toLocaleDateString('en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const resultCell = document.createElement('td');
        resultCell.textContent = result;

        row.appendChild(startDateCell);
        row.appendChild(endDateCell);
        row.appendChild(resultCell);
        tableResults.appendChild(row);
    })
}