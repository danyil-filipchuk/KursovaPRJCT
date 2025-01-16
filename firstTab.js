'use strict'

document.addEventListener("DOMContentLoaded", () => {

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
            changedDate = new Date(startDate.setDate(startDate.getDate() + 7))
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

        let result;

        if (optionDate.value === 'seconds') {
            result = (difference / seconds) + ' seconds';
        }
        if (optionDate.value === 'minutes') {
            result = (difference / minutes) + ' minutes';
        }
        if (optionDate.value === 'hours') {
            result = (difference / hours) + ' hours';
        }
        if (optionDate.value === 'days') {
            result = (difference / days) + ' days';
        }

        outputResult.textContent = `Result: ${result}`

    })

})