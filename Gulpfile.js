const gulp = require('gulp'); 
const clean = require('gulp-clean');
const shell = require('gulp-shell');
const sync = require('run-sequence');
const through = require('through2');
const webpack = require('webpack-stream');

const inlineTemplate = require('./inline-template.js');
/*
map of paths
 */
var paths = {
  entry: 'dist/index.js',
  dest: 'dist',
  bundle: 'dist/bundle',
  tmp: './tmp/',
  src: 'src',
  main: './src/',
  calendar: './src/calendar/'
};

gulp.task('backup', function() {
  return gulp.src([
      paths.main + 'fly-picker.component.ts',
      paths.calendar + 'calendar.component.ts'
    ]).pipe(gulp.dest(paths.tmp));
});

gulp.task('template-load-main', ['backup'], function() {
  return gulp.src(paths.main + 'fly-picker.component.ts')
    .pipe(through.obj(inlineTemplate))
    .pipe(gulp.dest(paths.main));
});

gulp.task('template-load-calendar', function() {
  return gulp.src(paths.calendar + 'calendar.component.ts')
    .pipe(through.obj(inlineTemplate))
    .pipe(gulp.dest(paths.calendar));
});

gulp.task('build', shell.task([
  'npm run tsc'
]));

gulp.task('entry-files', function() {
  return gulp.src(
    [
      './LICENSE',
      './README.md',
      './index.d.ts',
      './index.js',
      './package.json'
    ]).pipe(gulp.dest(paths.dest));
});

gulp.task('bundle', function() {
  return webpack(require('./webpack.config'))
    .pipe(gulp.dest(paths.bundle));
});

gulp.task('restore-main', function() {
  return gulp.src(paths.tmp + 'fly-picker.component.ts')
    .pipe(gulp.dest(paths.main));
});

gulp.task('restore-calendar', function() {
  return gulp.src(paths.tmp + 'calendar.component.ts')
    .pipe(gulp.dest(paths.calendar));
});

gulp.task('postbuild', function() {
  gulp.src(paths.tmp, {read: false})
    .pipe(clean());
});

gulp.task('default', function(done) {
  sync('template-load-main', 'template-load-calendar', 'build', 'entry-files', 'bundle', 'restore-main', 'restore-calendar', 'postbuild', done);
});
