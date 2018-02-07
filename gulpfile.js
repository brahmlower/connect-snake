// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
let babel = require('gulp-babel');

// Lint Task
gulp.task('lint', function() {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src('src/connect-snake.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(rename('connect-snake.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});
