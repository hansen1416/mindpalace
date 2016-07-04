var gulp    = require('gulp'),
    webpack = require('webpack-stream');

gulp.task('webpack', function() {

    gulp.src('./resources/assets/js/yang/yang-home.js')
        .pipe(webpack({
                          entry : './resources/assets/js/yang/yang-home.js',
                          output: {
                              filename: 'yang-home.js'
                          }
                      }))
        .pipe(gulp.dest('./public/js/'));


    gulp.src('./resources/assets/js/yang/yang-space.js')
        .pipe(webpack({
                          entry : './resources/assets/js/yang/yang-space.js',
                          output: {
                              filename: 'yang-space.js'
                          }
                      }))
        .pipe(gulp.dest('./public/js/'));

});



gulp.task('default', function(){
    gulp.run('webpack');
});


