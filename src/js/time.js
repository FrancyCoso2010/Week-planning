function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    document.getElementById('timenow').textContent = `${hours}:${minutes}:${seconds}`;
}



function updateClock() {
    updateTime();
}

setInterval(updateClock, 1000);

updateClock();