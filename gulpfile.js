var gulp    = require('gulp'),
    webpack = require('webpack-stream'),
    less    = require('gulp-less'),
    assets  = './resources/assets/';

gulp.task('webpack', function () {

    gulp.src(assets + 'js/yang/yang-home.js')
        .pipe(webpack({
                          entry : './resources/assets/js/yang/yang-home.js',
                          output: {
                              filename: 'yang-home.js'
                          }
                      }))
        .pipe(gulp.dest('./public/js/'));


    gulp.src(assets + 'js/yang/yang-space.js')
        .pipe(webpack({
                          entry : './resources/assets/js/yang/yang-space.js',
                          output: {
                              filename: 'yang-space.js'
                          }
                      }))
        .pipe(gulp.dest('./public/js/'));

});


gulp.task('less', function () {
    "use strict";

    gulp.src([assets + 'less/yang/yang-home.less', assets + 'less/yang/yang-space.less'])
        .pipe(less())
        .pipe(gulp.dest('./public/css/'));

    gulp.src(assets + 'less/yang/theme/*.less')
        .pipe(less())
        .pipe(gulp.dest('./public/css/theme/'));

});


gulp.task('default', function () {
    //gulp.run('webpack');
    gulp.run('less');
});


