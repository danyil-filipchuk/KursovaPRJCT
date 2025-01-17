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

    const seconds = 1000;
    const minutes = 1000 * 60;
    const hours = 1000 * 60 * 60;
    const days = 1000 * 60 * 60 * 24;

    let calculation;

    if (optionDate.value === 'seconds') {
        calculation = (difference / seconds) + ' seconds';
    }
    if (optionDate.value === 'minutes') {
        calculation = (difference / minutes) + ' minutes';
    }
    if (optionDate.value === 'hours') {
        calculation = (difference / hours) + ' hours';
    }
    if (optionDate.value === 'days') {
        calculation = (difference / days) + ' days';
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
        startDateCell.textContent = start;

        const endDateCell = document.createElement('td');
        endDateCell.textContent = end;

        const resultCell = document.createElement('td');
        resultCell.textContent = result;

        row.appendChild(startDateCell);
        row.appendChild(endDateCell);
        row.appendChild(resultCell);
        tableResults.appendChild(row);
    })
}