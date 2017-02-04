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
  tmp: 'tmp',
  src: 'src',
  component: 'src/fly-picker.component.ts'
};

gulp.task('backup', function() {
  return gulp.src(paths.component).pipe(gulp.dest(paths.tmp));
});

gulp.task('template-load', ['backup'], function() {
  return gulp.src(paths.component)
    .pipe(through.obj(inlineTemplate))
    .pipe(gulp.dest(paths.src));
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

gulp.task('restore', function() {
  return gulp.src(paths.tmp + '/*.ts').pipe(gulp.dest(paths.src));
});

gulp.task('postbuild', function() {
  gulp.src(paths.tmp, {read: false})
    .pipe(clean());
});

gulp.task('default', function(done) {
  sync('template-load', 'build', 'entry-files', 'bundle', 'restore', 'postbuild', done);
});
