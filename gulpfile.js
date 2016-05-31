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

var gulp = require('gulp'),
    rjs  = require('gulp-requirejs');

gulp.task('requirejsBuild', function() {
    /**
     * optimize the requireJs project
     * based on build-yang-universe.js
     */
    rjs({
            baseUrl:    './resources/assets/js/',
            name:       "build-yang-universe",
            out:        "universe.js",
            uglify:     {},
        })
    .pipe(gulp.dest('./public/js/'));
});

//do not generate the map
elixir.config.sourcemaps = false;

//compile less, optimize requireJs
elixir(function(mix) {
    mix.less('yang.less', 'public/css/yang.css');
    mix.less('home.less', 'public/css/home.css');
    mix.task('requirejsBuild');
});

