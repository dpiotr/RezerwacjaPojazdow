module.exports = (sequelize, type) => {
    return sequelize.define('car', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        registration_no: type.STRING,
        price: type.INTEGER,
        image: type.STRING
    })
};