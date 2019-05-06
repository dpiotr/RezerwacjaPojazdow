const Sequelize = require('sequelize');
const path = require('path');

const BrandModel = require('./models/brand');
const ModelModel = require('./models/model');
const CarModel = require('./models/car');
const ClientModel = require('./models/client');
const ReservationModel = require('./models/reservation');

const sequelize = new Sequelize('car_reservation', 'root', 'root', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: path.join(__dirname, 'car_reservation.sqlite'),
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const Brand = BrandModel(sequelize, Sequelize);
const Model = ModelModel(sequelize, Sequelize);
const Car = CarModel(sequelize, Sequelize);
const Client = ClientModel(sequelize, Sequelize);
const Reservation = ReservationModel(sequelize, Sequelize);

Model.belongsTo(Brand);
Brand.hasMany(Model);
Car.belongsTo(Model);

Reservation.belongsTo(Client);
Reservation.belongsTo(Car);

sequelize.sync({force: true})
    .then(() => {
        console.log(`Database & tables created!`);

        Brand.create({name: "BMW"});
        Brand.create({name: "Opel"});
        Brand.create({name: "Fiat"});

        Model.create({name: "Tipo", brandId: 3});

        Car.create({registration_no: "KR 12345", modelId: 1});
        Car.create({registration_no: "KR 12346", modelId: 1});

        Client.create({name: "Adam", surname: "Nowak", login: "adamnowak", password: "adamnowak"});
        Client.create({name: "Jan", surname: "Kowalski", login: "jankowalski", password: "jankowalski"});

        Reservation.create({start: 100, end: 200, clientId: 1, carId: 1});
    })
    .catch(reason => console.log("Wystapil blad: " + reason.message));

module.exports = {
    Brand,
    Model,
    Car,
    Client
};