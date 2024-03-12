document.addEventListener('DOMContentLoaded', function () {
    updateCalendar();
});

let currentDate = new Date();
let startDate = null;
let endDate = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

document.getElementById('prev-month').addEventListener('click', function () {
    if (currentMonth > 0) {
        currentMonth--;
    } else {
        currentMonth = 11;
        currentYear--;
    }
    currentDate = new Date(currentYear, currentMonth, 1);
    updateCalendar();
});
document.getElementById('clear-button').addEventListener('click', function () {
    // Limpiar los campos de las fechas de entrada y salida
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';

    // Quitar el sombreado del calendario
    const days = document.querySelectorAll('.day');
    days.forEach(day => {
        day.classList.remove('selected');
        day.classList.remove('range-highlight');
    });

    // Resetear las fechas de inicio y fin
    startDate = null;
    endDate = null;
});

document.getElementById('next-month').addEventListener('click', function () {
    if (currentMonth < 11) {
        currentMonth++;
    } else {
        currentMonth = 0;
        currentYear++;
    }
    currentDate = new Date(currentYear, currentMonth, 1);
    updateCalendar();
});

document.addEventListener('DOMContentLoaded', function () {
    // Llenar los nombres de los días de la semana
    const weekdaysContainer = document.getElementById('weekdays');
    const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    for (let i = 0; i < 7; i++) {
        const weekdayCell = document.createElement('div');
        weekdayCell.classList.add('weekday');
        weekdayCell.textContent = weekdays[i];
        weekdaysContainer.appendChild(weekdayCell);
    }

    updateCalendar();
});


function updateCalendar() {
    const currentMonthYearElement = document.getElementById('current-month-year');
    currentMonthYearElement.textContent = formatDate(currentDate, 'MMMM YYYY');

    const daysContainer = document.getElementById('days');
    daysContainer.innerHTML = '';

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const lastDateOfMonth = lastDayOfMonth.getDate();

    // Llenar días del mes anterior
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const dayCell = createDayCell(new Date(currentDate.getFullYear(), currentDate.getMonth(), -i));
        dayCell.classList.add('prev-month', 'outside-month'); // Agregar la nueva clase
        daysContainer.appendChild(dayCell);
    }

    // Llenar días del mes actual
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dayCell = createDayCell(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        daysContainer.appendChild(dayCell);

        // Verificar si el día es el día actual
        const today = new Date();
        if (currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() === today.getMonth() &&
            i === today.getDate()) {
            dayCell.classList.add('today');
        }
    }

    // Llenar días del próximo mes
    const lastDayOfWeek = lastDayOfMonth.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
        const dayCell = createDayCell(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i));
        dayCell.classList.add('next-month', 'outside-month'); // Agregar la nueva clase
        daysContainer.appendChild(dayCell);
    }


    // Añadir celdas vacías para llegar a 6 filas en total
    const totalDays = daysContainer.children.length;
    const rowsNeeded = 6;
    const additionalCellsNeeded = rowsNeeded * 7 - totalDays;

    for (let i = 0; i < additionalCellsNeeded; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day', 'empty');
        daysContainer.appendChild(emptyCell);
    }

    updateSelectedDates();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    document.getElementById('current-month-year').innerText = monthNames[currentMonth] + ' ' + currentYear;
}


function createDayCell(date) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');
    dayCell.textContent = date.getUTCDate();
    dayCell.setAttribute('data-date', formatDate(date, 'YYYY-MM-DD'));

    // Verificar si la fecha es anterior a la fecha actual
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Asegúrate de que la hora sea medianoche para una comparación precisa
    if (date < today) {
        dayCell.classList.add('past-day');
    } else {
        dayCell.addEventListener('click', selectDate);
        dayCell.addEventListener('mouseover', highlightRange);
    }

    return dayCell;
}

function selectDate(event) {
    const selectedDate = event.target.getAttribute('data-date');
    const selectedDay = new Date(selectedDate + 'T00:00'); // Añade 'T00:00' para especificar la hora

    // Verificar si la fecha seleccionada es anterior a la fecha actual
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Asegúrate de que la hora sea medianoche para una comparación precisa
    if (selectedDay < today) {
        return; // No hagas nada si la fecha seleccionada es anterior a la fecha actual
    }

    if (!startDate || (startDate && endDate)) {
        startDate = selectedDay;
        endDate = null;
    } else if (selectedDay > startDate) {
        endDate = selectedDay;
    } else {
        endDate = startDate;
        startDate = selectedDay;
    }

    updateSelectedDates();
}

function highlightRange(event) {
    const target = event.target;
    const selectedDate = target.getAttribute('data-date');

    if (selectedDate && startDate && !endDate) {
        const currentDate = new Date(selectedDate);
        const highlightedCells = document.querySelectorAll('.day');

        highlightedCells.forEach(cell => {
            const cellDate = new Date(cell.getAttribute('data-date'));
            if (cellDate > startDate && cellDate <= currentDate) {
                cell.classList.add('range-highlight');
            } else {
                cell.classList.remove('range-highlight');
            }
        });
    }
}

function updateSelectedDates() {
    const dayCells = document.querySelectorAll('.day');

    dayCells.forEach(dayCell => {
        const dayCellDate = new Date(dayCell.getAttribute('data-date') + 'T00:00');
        if ((startDate && +dayCellDate === +startDate) || (endDate && +dayCellDate === +endDate) || (startDate && endDate && dayCellDate > startDate && dayCellDate < endDate)) {
            dayCell.classList.add('selected');
        } else {
            dayCell.classList.remove('selected');
        }
    });

    // Actualiza los campos de entrada de las fechas de inicio y fin
    const startDateInput = document.querySelector('#start-date');
    const endDateInput = document.querySelector('#end-date');

    if (startDate) {
        startDateInput.value = formatDate(startDate, 'YYYY-MM-DD');
    }

    if (endDate) {
        endDateInput.value = formatDate(endDate, 'YYYY-MM-DD');
    }
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    updateCalendar();
}
function formatDate(date, format) {
    let day = date.getUTCDate();
    let month = date.getUTCMonth() + 1; // Los meses en JavaScript comienzan desde 0
    let year = date.getUTCFullYear();

    // Asegurarse de que el día y el mes sean de dos dígitos
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;

    if (format === 'YYYY-MM-DD') {
        return `${year}-${month}-${day}`;
    }

    return `${day}/${month}/${year}`;
}