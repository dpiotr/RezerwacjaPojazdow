class Reservation {
    constructor(id, start, end) {
        this.id = id;
        this.start = start;
        this.end = end;
    }
}

exports.getReservationModel = function (id, start, end) {
    return new Reservation(id, start, end)
};