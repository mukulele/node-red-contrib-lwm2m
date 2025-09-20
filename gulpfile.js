/**
 * @license
 * Copyright (c) 2019 CANDY LINE INC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const gulp        = require('gulp');
const babel       = require('gulp-babel');
const uglify      = require('gulp-uglify');
const del         = require('del').deleteAsync;
const mocha       = require('gulp-mocha').default;
const sourcemaps  = require('gulp-sourcemaps');
const gulpif      = require('gulp-if');
const cleancss    = require('gulp-clean-css');
const yaml        = require('gulp-yaml');

const minified = process.env.NODE_ENV !== 'development';
const sourcemapEnabled = !minified;


gulp.task('clean', () => {
  return del([
    './dist',
    './build',
    './*.tgz',
  ]);
});

gulp.task('cleanTestJs', () => {
  return del([
    'dist/**/*.test.js',
  ]);
});

gulp.task('i18n', () => {
  return gulp.src([
      './lib/locales/**/*.{yaml,yml}'
    ])
    .pipe(yaml({ safe: true }))
    .pipe(gulp.dest('./dist/locales'));
});

gulp.task('assets', gulp.series('i18n', () => {
  return gulp.src([
      './lib/**/*.{less,ico,png,json,yaml,yml}',
      '!./lib/locales/**/*.{yaml,yml}'
    ])
    .pipe(gulp.dest('./dist'));
}));

gulp.task('js', gulp.series('assets', () => {
  return gulp.src('./lib/**/*.js')
    .pipe(gulpif(sourcemapEnabled, sourcemaps.init()))
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(gulpif(!sourcemapEnabled, uglify({
      mangle: minified,
      output: {
        comments: 'some',
      },
      compress: {
        dead_code: true,
        drop_debugger: true,
        properties: true,
        unused: true,
        toplevel: true,
        if_return: true,
        drop_console: true,
        conditionals: true,
        unsafe_math: true,
        unsafe: true
      }
    })))
    .pipe(gulpif(sourcemapEnabled, sourcemaps.write('.')))
    .pipe(gulp.dest('./dist'));
}));



gulp.task('build', gulp.series('js', 'assets'));

gulp.task('testAssets', () => {
  return gulp.src('./tests/**/*.{css,less,ico,png,html,json,yaml,yml}')
  .pipe(gulp.dest('./dist'));
});

gulp.task('testJs', gulp.series('cleanTestJs', 'build', () => {
  return gulp.src('./tests/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));
}));

gulp.task('test', gulp.series('testJs', 'testAssets', done => {
  return gulp.src([
    './dist/**/*.test.js',
  ], {read: false})
  .pipe(mocha({
    require: ['source-map-support/register'],
    reporter: 'spec'
  }))
  .once('error', () => { done();process.exit(1); })
  .once('end', () => { done();process.exit(); })
}));

gulp.task('default',gulp.series('build'));
