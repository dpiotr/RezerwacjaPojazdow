module.exports = (sequelize, type) => {
    return sequelize.define('model', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING
    })
};