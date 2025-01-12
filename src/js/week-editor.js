function fetchSchedule() {
    fetch('./data/week.json')
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