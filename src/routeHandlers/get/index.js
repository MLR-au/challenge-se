'use strict';

const fs = require('fs');
const path = require('path');

fs.readdirSync(__dirname + '/').forEach(function(file) {
    if (file.match(/\.js$/) !== null && file !== 'index.js') {
        var name = file.replace('.js', '');
        module.exports[name] = require('./' + file);
    }
});
