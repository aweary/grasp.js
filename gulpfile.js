var gulp = require('gulp');
var uglify = require('gulp-uglify');
var spawn = require('child_process').spawn;
var util = require('gulp-util');
var fs = require('fs');
var sequence = require('run-sequence');

gulp.task('minify', function() {
  gulp.src('./build/bundle.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/'));
});
