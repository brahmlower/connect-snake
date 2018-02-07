// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');

// Lint Task
gulp.task('lint', function() {
  return gulp.src('connect-snake.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
