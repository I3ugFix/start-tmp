var gulp        = require('gulp');
var sass        = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref      = require('gulp-useref');
var uglify      = require('gulp-uglify');
var gulpIf      = require('gulp-if');
var cssnano     = require('gulp-cssnano');
var imagemin    = require('gulp-imagemin');
var del         = require('del');
var runSequence = require('run-sequence');
var yarn        = require('gulp-yarn');
var plumber     = require('gulp-plumber');
var coffee      = require('gulp-coffee');
var sourcemaps  = require('gulp-sourcemaps');
var notify      = require('gulp-notify'); 

//gulp-notify
var notify = require("gulp-notify");

gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(notify("Sass is under control Papi!!"));
});

gulp.watch('app/scss/**/*.scss', ['sass']);

gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  // Other watchers
  gulp.watch('app/**/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
}); 

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})

gulp.task('yarn', function() {
  return gulp.src(['./package.json', './yarn.lock'])
    .pipe(gulp.dest('./dist'))
    .pipe(yarn({
        production: true
    }));
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
}) 

gulp.task('hi', function() {
  console.log('All is OK papi');
});