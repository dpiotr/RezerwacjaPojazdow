function dateChanged(price) {
    const oneDay = 24 * 60 * 60 * 1000;

    let startDate = new Date(document.getElementById("startDate").value);
    let endDate = new Date(document.getElementById("endDate").value);

    let priceInput = document.getElementById("price");

    if (startDate <= endDate) {
        let days = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / (oneDay))) + 1;

        priceInput.value = days * price
    } else {
        priceInput.value = "Cena nieznana"
    }
}

function validateReservation(e) {
    let start = document.getElementById("startDate").value;
    let end = document.getElementById("endDate").value;
    let reservationForm = document.getElementById("reservationForm");

    let startDate = new Date(start);
    let endDate = new Date(end);
    let todayDate = new Date();

    if (startDate > endDate) {
        alert("Data początkowa nie może być później niż data końcowa.");
        return false;
    }

    if (startDate < todayDate) {
        alert("Data początkowa nie może być w przeszłości.");
        return false;
    }

    reservationForm.submit();
}