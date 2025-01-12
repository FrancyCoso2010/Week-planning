function fetchSchedule() {
    fetch('./week.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            getEvent(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            displayError('Errore nel caricamento degli eventi.');
        });
}

function displayError(message) {
    const eventContainer = document.getElementById('odiernoContainer');
    eventContainer.innerHTML = `<p>${message}</p>`;
    eventContainer.style.display = 'block';
}


function createEventElement(event) {
    const eventElement = document.createElement('div');
    eventElement.classList.add('event');

    const nameElement = document.createElement('div');
    nameElement.classList.add('event-name');
    nameElement.textContent = event.name;
    eventElement.appendChild(nameElement);

    const startTimeElement = document.createElement('div');
    startTimeElement.classList.add('event-time');
    startTimeElement.textContent = event.start;
    eventElement.appendChild(startTimeElement);

    const endTimeElement = document.createElement('div');
    endTimeElement.classList.add('event-time');
    endTimeElement.textContent = event.end || 'N/A';
    eventElement.appendChild(endTimeElement);

    return eventElement;
}

function getEvent(data) {
    const today = new Date().getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const eventContainer = document.getElementById('eventsListContainer');
    const nextEventDisplay = document.getElementById('nextEventDisplay');
    const counterDisplay = document.getElementById('counterDisplay');

    eventContainer.innerHTML = '';
    nextEventDisplay.innerHTML = '';
    counterDisplay.innerHTML = ''; 

    let hasEvents = false;
    let finishedTodayEvent = false;

    const eventsForToday = data[today];
    const eventsForTomorrow = data[(today + 1) % 7];

    if (eventsForToday) {
        const now = new Date();
        let nextEventFound = false;

        Object.keys(eventsForToday).forEach((key) => {
            const event = eventsForToday[key];
            const eventElement = createEventElement(event);
            eventContainer.appendChild(eventElement);

            // Check if the event is finished
            if (event.isFinished) {
                finishedTodayEvent = true;
                console.log('Event Finished:', event.name);
            } else {
                const [eventHours, eventMinutes] = event.start.split(':');
                const eventTime = new Date();
                eventTime.setHours(eventHours, eventMinutes, 0, 0);

                if (now < eventTime && !nextEventFound) {
                    nextEventDisplay.innerHTML = `${event.name} alle ${event.start}`;
                    startCountdown(event, counterDisplay, false);
                    nextEventFound = true; 
                    console.log('Next event:', event.name);
                }
            }

            hasEvents = true;
        });

        // If no next event was found and the last event was finished, check for tomorrow's events
        if (!nextEventFound && finishedTodayEvent && eventsForTomorrow) {
            console.log('No more events for today, checking tomorrow');
            const nextEvent = Object.values(eventsForTomorrow)[0];
            if (nextEvent) {
                handleNextEventForTomorrow(nextEvent, nextEventDisplay, counterDisplay);
                hasEvents = true;
            }
        }
    }

    eventContainer.style.display = hasEvents ? 'grid' : 'none';
}



function handleNextEventForTomorrow(nextEvent, nextEventDisplay, counterDisplay) {
    nextEventDisplay.innerHTML = `${nextEvent.name} alle ${nextEvent.start}`;
    startCountdown(nextEvent, counterDisplay, true);
    console.log('first event for tomorrow:', nextEvent.name);
}

function startCountdown(event, counterDisplay, isTomorrow) {
    const nextEventTime = new Date();
    const [hours, minutes] = event.start.split(':');
    nextEventTime.setHours(hours, minutes, 0, 0);

    if (isTomorrow) {
        nextEventTime.setDate(nextEventTime.getDate() + 1);
    }

    const countdown = setInterval(() => {
        const now = new Date();
        const timeDiff = nextEventTime.getTime() - now.getTime();

        if (timeDiff <= 0) {
            clearInterval(countdown);
            counterDisplay.innerHTML = `${event.name} è iniziato!`;
        } else {
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000 + 1);
            counterDisplay.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
}

function getTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

window.onload = () => {
    fetchSchedule();
    setInterval(() => {
        document.getElementById('timenow').textContent = getTime();
    }, 1000);
}; 
