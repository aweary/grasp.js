var gulp = require('gulp');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var rename = require('gulp-rename');
var sequence = require('run-sequence');

gulp.task('minify', function() {
  gulp.src('./build/bundle.js')
    .pipe(uglify())
    .pipe(rename('build.min.js'))
    .pipe(gulp.dest('./build/'));
});
