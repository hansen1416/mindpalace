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

// elixir(function(mix) {
//     mix.less('app.less');
// });

elixir(function(mix) {
    mix.less('yang.less');
});

elixir(function(mix) {
    mix.scripts(['common.js', 'universe.js'], 'public/js/universe.js');
});