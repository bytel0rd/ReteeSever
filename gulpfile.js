var gulp = require('gulp');
var docco = require("gulp-docco");

var gulpUtil = require('gulp-util');

gulp.task('default', function() {
  gulp.watch('*.js', ['document']);
  return gulpUtil.log("gulp is runing now");
});

gulp.task('document', function() {

  gulpUtil.log("documenting javascripts ");
  gulp.src("./routes/*.js")
    .pipe(docco())
    .pipe(gulp.dest('./documentation-output'));
  // gulp.src("./models/*.js")
  //   .pipe(docco())
  //   .pipe(gulp.dest('./documentation-output'));
  // gulp.src("./routes/auth/*.js")
  //   .pipe(docco())
  //   .pipe(gulp.dest('./documentation-output'));
  // gulp.src("./routes/**/*.js")
  //   .pipe(docco())
  //   .pipe(gulp.dest('./documentation-output'));

});
