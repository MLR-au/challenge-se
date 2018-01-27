'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const Sequelize = require('sequelize');
const db = {};

const database = process.env.DB_NAME || 'markr';
const username = process.env.DB_USER || 'markr';
const password = process.env.DB_PASS || 'markr';

const sequelize = new Sequelize(database, username, password, {
    dialect: 'sqlite',
    storage: 'data.sqlite'
});

fs
    .readdirSync(__dirname)
    .filter(
        file =>
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
    )
    .forEach(file => {
        const model = require(`./${file}`)(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
