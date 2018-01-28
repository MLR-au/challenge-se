'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const wait = require('gulp-wait');

gulp.task('nodemon', cb => {
    let started = false;

    return nodemon({
        script: 'index.js'
    })
        .on('start', () => {
            if (!started) {
                started = true;
                return cb();
            }
        })
        .on('restart', () => {});
});

gulp.task('test', ['nodemon'], function() {
    return gulp
        .src('./e2e/*.js')
        .pipe(wait(3000))
        .pipe(mocha({reporter: 'spec', watch: 'e2e'}))
        .once('error', function() {
            process.exit(1);
        })
        .once('end', function() {
            process.exit();
        });
});
