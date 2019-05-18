module.exports = (sequelize, type) => {
    return sequelize.define('reservation', {
        start: type.INTEGER,
        end: type.INTEGER,
        price: type.INTEGER
    })
};