const gulp = require('gulp');
const path = require('path');

const concat = require('gulp-concat-util');
const folders = require('gulp-folders');
const docco = require('gulp-docco');



const gulpUtil = require('gulp-util');

function defaultTask() {
  gulp.watch('*.js', ['concat:Routes', 'concat:Home','document']);
  gulp.watch('./dest/dest.js', ['document']);
  return gulpUtil.log('gulp is runing now');
}

// const concatjs = folders(pathToFolder, (folder) => {
//   return gulp.src(path.join(pathToFolder, folder, '*.js'))
//     .pipe(concat(folder + '.js'))
//     .pipe(gulp.dest('./dest'));
// });
gulp.task('default', defaultTask);

// This will loop over all folders inside pathToFolder main, secondary
// Return stream so gulp-folders can document all of them
// so you still can use safely use gulp multitasking

const pathToRoutes = './routes';
gulp.task('concat:Routes', folders(pathToRoutes, (folder) => {
  gulpUtil.log('gulp is cocating Routes now');
  return gulp.src(path.join(pathToRoutes, folder, '*.js'))
    .pipe(concat(folder + '.js'))
    .pipe(gulp.dest('./dest'));
}));

const pathToHome = './';
gulp.task('concat:Home', folders(pathToHome, (folder) => {
  gulpUtil.log('gulp is cocating Homes now');
  return gulp.src(path.join(pathToHome, folder, '*.js'))
    .pipe(concat(folder + '.js'))
    .pipe(gulp.dest('./dest'));
}));

gulp.task('document',function () {
  gulp.src("./dest/dest.js")
  .pipe(docco())
  .pipe(gulp.dest('./documentation-output'))
});


// gulp.src(path.join(pathToFolder, folder, '*.js'))
//   .pipe(docco())


// .pipe(docco())
