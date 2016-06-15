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
     * based on build-yang-space.js
     */
    rjs({
            baseUrl:    './resources/assets/js/',
            name:       "build-yang-space",
            out:        "yang-space.js",
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
            out:        "yang-home.js",
        })
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));

});

//do not generate the map
elixir.config.sourcemaps = false;

//compile less, optimize requireJs
elixir(function(mix) {
    mix.less('yang-space.less', 'public/css/yang-space.css');
    mix.less('yang-home.less', 'public/css/yang-home.css');
    mix.task('requirejsBuild');
});

