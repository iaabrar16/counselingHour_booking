const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDate = new Date();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar(currentMonth, currentYear);
    document.getElementById('booking-form').addEventListener('submit', bookSession);
    displaySessions();
});

function renderCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();
    firstDay = firstDay === 0 ? 7 : firstDay; // Adjust if first day of the month is Sunday
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tbl = document.getElementById("calendar-body");
    tbl.innerHTML = ""; // Clearing all previous cells

    // Filling data about month and in the page via DOM.
    document.getElementById("monthAndYear").innerHTML = months[month] + " " + year;

    // Creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");
            if (i === 0 && j < firstDay - 1) {
                cell.classList.add("disabled");
                row.appendChild(cell);
            } else if (date > daysInMonth) {
                cell.classList.add("disabled");
                row.appendChild(cell);
            } else {
                cell.innerText = date;
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("selected"); // Color today's date
                }
                cell.addEventListener('click', (function(d, m, y) {
                    return function() {
                        selectDate(d, m, y);
                    }
                })(date, month, year));
                row.appendChild(cell);
                date++;
            }
        }

        tbl.appendChild(row); // Append each row into calendar body.
    }
}

function selectDate(day, month, year) {
    selectedDate.setFullYear(year, month, day);

    document.querySelectorAll('.days-table td').forEach(td => {
        td.classList.remove('selected');
    });

    let allCells = document.querySelectorAll('.days-table td');
    let currentCell = [...allCells].find(td => parseInt(td.textContent) === day);
    currentCell.classList.add('selected');
}

function changeMonth(step) {
    currentMonth = currentMonth + step;
    if (currentMonth < 0 || currentMonth > 11) {
        currentYear = currentYear + Math.sign(step);
        currentMonth = (currentMonth + 12) % 12;
    }
    renderCalendar(currentMonth, currentYear);
}

function bookSession(e) {
    e.preventDefault();

    const time = document.getElementById('time').value;
    const name = document.getElementById('name').value;
    const course = document.getElementById('course').value;
    const section = document.getElementById('section').value;
    const topic = document.getElementById('topic').value;
    const sessionDate = `${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

    const session = { sessionDate, time, name, course, section, topic };
    saveSession(session);
    displaySessions();
    e.target.reset();
}

function saveSession(session) {
    let sessions = JSON.parse(localStorage.getItem('sessions')) || [];
    sessions.push(session);
    localStorage.setItem('sessions', JSON.stringify(sessions));
}

function displaySessions() {
    let sessions = JSON.parse(localStorage.getItem('sessions')) || [];
    let sessionsContainer = document.getElementById('booked-sessions');
    sessionsContainer.innerHTML = '';
    sessions.forEach(session => {
        let sessionDiv = document.createElement('div');
        sessionDiv.classList.add('session-entry');
        sessionDiv.innerHTML = `
            <div>Date: ${session.sessionDate}</div>
            <div>Time: ${session.time}</div>
            <div>Name: ${session.name}</div>
            <div>Course: ${session.course}</div>
            <div>Section: ${session.section}</div>
            <div>Topic: ${session.topic}</div>
        `;
        sessionsContainer.appendChild(sessionDiv);
    });
}

function selectDate(day, month, year) {
    // Clear previous selection
    document.querySelectorAll('#calendar-body .selected').forEach(td => {
        td.classList.remove('selected');
    });

    // Set new selection
    selectedDate.setFullYear(year, month, day);
    let allCells = document.querySelectorAll('#calendar-body td');
    allCells.forEach(td => {
        if (td.innerText == day) {
            td.classList.add('selected');
        }
    });
    
    // You could update an input field with the selected date here if needed.
    // document.getElementById('selected-date-input').value = `${year}-${month + 1}-${day}`;
}
