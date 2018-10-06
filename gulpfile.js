// Requirements
const gulp = require('gulp');
const gulpif = require('gulp-if');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config')
const browserSync = require('browser-sync').create();

// Tasks
gulp.task('pug:dev', () => views('./dist'));
gulp.task('pug:prod', () => views('./build'));
gulp.task('sass:dev', () => styles('./dist'));
gulp.task('sass:prod', () => styles('./build', false));
gulp.task('js:dev', () => scripts('development', './dist'));
gulp.task('js:prod', () => scripts('production', './build'));

// Pug
const views = (dest) => {
  return gulp.src('./src/view/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream())
}

// Sass
const styles = (dest, map = true) => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(gulpif(map, sourcemaps.init()))
    .pipe(sass())
    .pipe(postcss())
    .pipe(gulpif(map, sourcemaps.write('./')))
    .pipe(gulp.dest(`${dest}/css`))
    .pipe(browserSync.stream())
}

// Webpack Babel
const scripts = (mode, dest) => {
  webpackConfig.mode = mode;
  return gulp.src('./src/js/main.js')
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(`${dest}/js`))
    .pipe(browserSync.stream())
}

// Dev serve + watch
gulp.task('default', ['pug:dev', 'sass:dev', 'js:dev'], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  })
  gulp.watch('./src/view/**/*.pug', ['pug:dev']);
  gulp.watch('./src/scss/**/*.scss', ['sass:dev']);
  gulp.watch('./src/js/**/*.js', ['js:dev']);
})

// Build
gulp.task('build', ['pug:prod', 'sass:prod', 'js:prod'], () => {
  let textColor = '\x1b[33m%s\x1b[0m';
  console.log(textColor, '==============================');
  console.log(textColor, '🏗  Build completed in: ./build');
  console.log(textColor, '==============================');
})
