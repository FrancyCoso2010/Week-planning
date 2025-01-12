function createNewInputRow(dayId) {
    const cell = document.getElementById(dayId);
    const newInputRow = document.createElement('div');
    newInputRow.className = 'input-row';

    newInputRow.innerHTML = `
        <input type="text" name="eventName" placeholder="Nome evento">
        <input type="time" name="eventStart" placeholder="Inizio">
        <input type="time" name="eventEnd" placeholder="Fine">
    `;

    cell.appendChild(newInputRow);

    const inputs = newInputRow.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', handleInputChange);
    });
}

function handleInputChange(event) {
    const input = event.target;

    if (input.name === 'eventName' && input.value) {
        const cell = input.closest('.cell');
        createNewInputRow(cell.id);
        input.removeEventListener('input', handleInputChange);
    }
}

function saveEvents() {
    const events = {};
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    days.forEach((day, index) => {
        const cell = document.getElementById(day);
        const inputRows = cell.querySelectorAll('.input-row');

        inputRows.forEach((row, eventIndex) => {
            const eventName = row.querySelector('input[name="eventName"]').value;
            const eventStart = row.querySelector('input[name="eventStart"]').value;
            const eventEnd = row.querySelector('input[name="eventEnd"]').value;

            if (eventName) {
                if (!events[index]) {
                    events[index] = {};
                }
                events[index][eventIndex] = {
                    name: eventName,
                    start: eventStart,
                    end: eventEnd
                };
            }
        });
    });

    localStorage.setItem('events', JSON.stringify(events));
    alert('Events saved to local storage!');
}

function downloadEvents() {
    const events = {};
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    days.forEach((day, index) => {
        const cell = document.getElementById(day);
        const inputRows = cell.querySelectorAll('.input-row');

        inputRows.forEach((row, eventIndex) => {
            const eventName = row.querySelector('input[name="eventName"]').value;
            const eventStart = row.querySelector('input[name="eventStart"]').value;
            const eventEnd = row.querySelector('input[name="eventEnd"]').value;

            if (eventName) {
                if (!events[index]) {
                    events[index] = {};
                }
                events[index][eventIndex] = {
                    name: eventName,
                    start: eventStart,
                    end: eventEnd
                };
            }
        });
    });

    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const events = JSON.parse(e.target.result);
            populateEvents(events);
            alert('Events loaded successfully!');
        } catch (error) {
            alert('Error loading events: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function populateEvents(events) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    days.forEach((day, index) => {
        const cell = document.getElementById(day);
        
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }

        if (events[index]) {
            Object.values(events[index]).forEach(event => {
                const newInputRow = document.createElement('div');
                newInputRow.className = 'input-row';
                newInputRow.innerHTML = `
                    <input type="text" name="eventName" placeholder="Nome evento" value="${event.name}">
                    <input type="time" name="eventStart" placeholder="Inizio" value="${event.start}">
                    <input type="time" name="eventEnd" placeholder="Fine" value="${event.end}">
                `;
                cell.appendChild(newInputRow);
            });
        }
    });

    document.querySelectorAll('.cell input[name="eventName"]').forEach(input => {
        input.addEventListener('input', handleInputChange);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.cell input[name="eventName"]').forEach(input => {
        input.addEventListener('input', handleInputChange);
    });

    document.getElementById('saveEventsButton').addEventListener('click', saveEvents);
    document.getElementById('downloadEventsButton').addEventListener('click', downloadEvents);
    document.getElementById('uploadEventsButton').addEventListener('change', handleFileUpload);
});