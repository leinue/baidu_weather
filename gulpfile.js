var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    connect = require('gulp-connect');

var htmlmin = require('gulp-htmlmin');
var revCollector = require('gulp-rev-collector');
var rev = require('gulp-rev');

gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('html', function() {
  return gulp.src('./src/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload()); //输出
});

gulp.task('css', function () {
    var cssSrc = './src/css/*.css',
        cssDst = './build/css';

    gulp.src(cssSrc)
        .pipe(gulp.dest(cssDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(cssDst))
        .pipe(connect.reload()); //输出
});

gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(connect.reload());;  //输出
});

gulp.task('images', function() {
    return gulp.src('src/imgs/*')
        .pipe(gulp.dest('build/imgs'))
        .pipe(connect.reload()); //输出
});

gulp.task('clean', function(cb) {
    del(['build/css', 'build/js', 'build/imgs'], cb)
});

gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch('src/js/*.js', ['js']);
})

gulp.task('watch', function () {
    gulp.watch(['src/*.html', 'src/js/*.js', 'src/css/*.css', 'src/imgs/*'], ['html', 'js', 'css', 'images']);
})

gulp.task('build', ['clean', 'css', 'js', 'images', 'html'], function() {
    gulp.start('css', 'js', 'images');
});

gulp.task('default', ['clean', 'css', 'js', 'images', 'html', 'auto'], function() {
    gulp.start('css', 'js', 'images');
});

gulp.task('serve', ['connect', 'watch']);
