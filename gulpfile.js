var gulp     = require('gulp'),
    pump     = require('pump'),
    webpack  = require('webpack-stream'),
    minifier = require('gulp-uglify/minifier'),
    harmony  = require('uglify-js-harmony'),
    options  = {},
    less     = require('gulp-less'),
    cssnano  = require('gulp-cssnano'),
    assets   = './resources/assets/';

gulp.task('webpack_home', function (cb) {
    "use strict";

    pump([
             gulp.src(assets + 'js/yang/yang-home.js'),
             webpack({
                         entry : './resources/assets/js/yang/yang-home.js',
                         output: {
                             filename: 'yang-home.js'
                         }
                     }),
             gulp.dest('public/js'),
             minifier(options, harmony),
             gulp.dest('public/js')
         ],
         cb
    );

});

gulp.task('webpack_space', function (cb) {
    "use strict";

    pump([
             gulp.src(assets + 'js/yang/yang-space.js'),
             webpack({
                         entry : './resources/assets/js/yang/yang-space.js',
                         output: {
                             filename: 'yang-space.js'
                         }
                     }),
             gulp.dest('public/js')
         ],
         cb
    );


});


gulp.task('less', function () {
    "use strict";

    gulp.src([assets + 'less/yang/yang-home.less', assets + 'less/yang/yang-space.less'])
        .pipe(less())
        .pipe(gulp.dest('public/css'))
        .pipe(cssnano())
        .pipe(gulp.dest('public/css'));

    gulp.src(assets + 'less/yang/theme/*.less')
        .pipe(less())
        .pipe(gulp.dest('public/css/theme'))
        .pipe(cssnano())
        .pipe(gulp.dest('public/css/theme'));

});


gulp.task('default', function () {
    gulp.run('webpack_home');
    gulp.run('webpack_space');
    gulp.run('less');
});


