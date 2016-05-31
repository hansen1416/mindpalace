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

elixir.config.sourcemaps = false;

elixir(function(mix) {
    mix.less('yang.less', 'public/css/yang.css');
    mix.less('home.less', 'public/css/home.css');
    //mix.version(['css/yang.css', 'public/css/home.css']);
});

//elixir(function(mix) {
//    mix.scripts(['common.js', 'universe.js'], 'public/js/universe.js');
//});