module.exports = (sequelize, type) => {
    return sequelize.define('client', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        surname: type.STRING,
        login: type.STRING,
        password: type.STRING
    })
};