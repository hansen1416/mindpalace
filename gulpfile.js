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
    rjs({
            baseUrl: './resources/assets/js/',
            name: "app-universe",
            out: "./public/js/universe.js",
        }); // pipe it to the output DIR
});

elixir.config.sourcemaps = false;

elixir(function(mix) {
    //mix.less('yang.less', 'public/css/yang.css');
    //mix.less('home.less', 'public/css/home.css');
    mix.task('requirejsBuild');
    //mix.version(['css/yang.css', 'public/css/home.css']);
});

