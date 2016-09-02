'use strict'

require('dotenv').config({silent: true})

var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
require('babel-register')

gulp.task('test', () => {
  return gulp
    .src(['test/**/*_test.js'], {read: false})
    .pipe($.mocha())
    .once('end', () => process.exit())
})

gulp.task('default', ['test'])
