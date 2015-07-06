var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('minify', function() {
  gulp.src('./src/index.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build'));
});
