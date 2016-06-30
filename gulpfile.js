var gulp = require('gulp');
var path = require('path');

var concat = require('gulp-concat-util');
var folders = require('gulp-folders');
var docco = require('gulp-docco');

var gulpUtil = require('gulp-util');

function defaultTask() {
  gulp.watch('*.js', ['concat:Routes', 'concat:Home', 'concat:All', 'document']);
  gulp.watch('./dest/dest.js', ['document']);
  return gulpUtil.log('gulp is runing now');
}

// var concatjs = folders(pathToFolder, (folder) => {
//   return gulp.src(path.join(pathToFolder, folder, '*.js'))
//     .pipe(concat(folder + '.js'))
//     .pipe(gulp.dest('./dest'));
// });
gulp.task('default', defaultTask);

// This will loop over all folders inside pathToFolder main, secondary
// Return stream so gulp-folders can document all of them
// so you still can use safely use gulp multitasking

var pathToRoutes = './routes';
gulp.task('concat:Routes', folders(pathToRoutes, (folder) => {
  gulpUtil.log('gulp is cocating Routes now');
  return gulp.src(path.join(pathToRoutes, folder, '*.js'))
    .pipe(concat(folder + '.js'))
    .pipe(gulp.dest('./dest/tmp'));
}));

var pathToHome = './';
gulp.task('concat:Home', folders(pathToHome, (folder) => {
  gulpUtil.log('gulp is cocating Homes now');
  return gulp.src(path.join(pathToHome, folder, '*.js'))
    .pipe(concat(folder + '.js'))
    .pipe(gulp.dest('./dest/tmp'));
}));


var pathToHome = './dest/';
gulp.task('concat:All', folders(pathToHome, (folder) => {
  gulpUtil.log('gulp is cocating Homes now');
  return gulp.src(path.join(pathToHome, folder, '*.js'))
    .pipe(concat(folder + '.js'))
    .pipe(gulp.dest('./dest'));
}));

gulp.task('document', () => {
  gulp.src('./dest/dest.js')
    .pipe(docco())
    .pipe(gulp.dest('./documentation-output'));
});


// gulp.src(path.join(pathToFolder, folder, '*.js'))
//   .pipe(docco())


// .pipe(docco())
