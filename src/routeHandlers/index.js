'use strict';

const fs = require('fs');
const path = require('path');

module.exports = loadRouteHandlers();

function loadRouteHandlers() {
    const routersDir = path.resolve(`${__dirname}`);
    let pathComponents = {};
    fs
        .readdirSync(routersDir)
        .filter(file => fs.lstatSync(`${routersDir}/${file}`).isDirectory())
        .filter(file => file !== '.AppleDouble')
        .forEach(routerDir => {
            pathComponents[routerDir] = require(`${routersDir}/${routerDir}`);
        });

    return pathComponents;
}
