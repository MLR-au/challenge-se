'use strict';

const fs = require('fs');
const path = require('path');

fs
    .readdirSync(__dirname + '/')
    .filter(file => file.match(/\.js$/))
    .filter(file => file !== 'index.js')
    .forEach(function(file) {
        var name = file.replace('.js', '');
        module.exports[name] = require('./' + file);
    });
