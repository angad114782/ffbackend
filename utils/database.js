const { Sequelize } = require("sequelize");

const connection = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
    dialect: "mysql",
    host: "localhost",
    logging: false
})

connection.authenticate().then(() => {
    console.log('authentication successful')
}).catch(err => {
    console.log(err)
})

module.exports = connection;