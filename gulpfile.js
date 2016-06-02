var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

var gulp   = require('gulp'),
    rjs    = require('gulp-requirejs'),
    uglify = require('gulp-uglify');

gulp.task('requirejsBuild', function() {
    /**
     * optimize the requireJs project
     * based on build-yang-universe.js
     */
    rjs({
            baseUrl:    './resources/assets/js/',
            name:       "build-yang-universe",
            out:        "universe.js",
        })
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));

    /**
     * optimize the requireJs project
     * based on build-yang-home.js
     */
    rjs({
            baseUrl:    './resources/assets/js/',
            name:       "build-yang-home",
            out:        "home.js",
        })
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));

});

//do not generate the map
elixir.config.sourcemaps = false;

//compile less, optimize requireJs
elixir(function(mix) {
    mix.less('yang-universe.less', 'public/css/yang-universe.css');
    mix.less('yang-home.less', 'public/css/yang-home.css');
    mix.task('requirejsBuild', './resources/js/**/*.js');
});

