'use strict';
var clean, concat, connect, es, flatten, gulp, minifyCss, minifyHtml, ngAnnotate, paths, prefix, replace, rev, templateCache, uglify, usemin, exec, ngConstant, yargv, rename, browserSync, reload;

gulp            = require('gulp');
prefix          = require('gulp-autoprefixer');
minifyCss       = require('gulp-minify-css');
usemin          = require('gulp-usemin');
uglify          = require('gulp-uglify');
minifyHtml      = require('gulp-minify-html');
ngAnnotate      = require('gulp-ng-annotate');
rev             = require('gulp-rev');
connect         = require('gulp-connect');
es              = require('event-stream');
flatten         = require('gulp-flatten');
clean           = require('gulp-clean');
replace         = require('gulp-replace');
concat          = require('gulp-concat');
templateCache   = require('gulp-angular-templatecache');
exec            = require('child_process').exec;
ngConstant      = require('gulp-ng-constant');
yargv           = require('yargs').argv;
rename          = require('gulp-rename');
browserSync     = require('browser-sync');
reload          = browserSync.reload;


paths = {
  app: '../',
  src: 'angular/',
  js: 'js/',
  dist: 'dist/',
  //scss: 'src/main/scss/',
  views: '../templates/'
};

var version = '0.2';
var env = yargv.env;


gulp.task('getVersion', function(cb) {
    exec('git describe --tags', function(error, stdout, stderr) {
        if (error) return cb(error); // return error
        version = stdout;
          ngConstant({
                name: 'flask',
                constants: { version: version, env: env },
                stream: true,
                deps: false
          }).pipe(rename('flask.constants.js')).pipe(gulp.dest(paths.js));
        cb(); // finished task
    });
});

gulp.task('clean', function() {
  return gulp.src(paths.dist, {
    read: false
  }).pipe(clean());
});

gulp.task('test', function() {
  return karma.once;
});

gulp.task('copy', ['clean'], function() {
return es.merge(
            gulp.src(paths.app + 'i18n/**').pipe(gulp.dest(paths.dist + 'i18n/')),
            gulp.src(paths.app + 'favicon.ico').pipe(gulp.dest(paths.dist))
            );
});

gulp.task('images', function() {
  return es.merge(
      gulp.src(paths.app + 'img*//**'),
      gulp.src(paths.app + 'protected*//**'))
  .pipe(gulp.dest(paths.dist));
});

gulp.task('js', function() {
  return es.merge(
      gulp.src(paths.src + '**/*.js'),
      gulp.src(paths.src + 'directives/**/*.html').pipe(templateCache({
          module: 'flaskAngular'
      }))
    ).pipe(concat('flask.js')).pipe(gulp.dest(paths.js)).pipe(reload({stream: true})).on('error', function(error) {
    console.log(error);
    this.emit('end');
  });
});

gulp.task('fonts', function() {
  return gulp.src(paths.app + '**/*.{woff,svg,ttf,eot}').pipe(flatten()).pipe(gulp.dest(paths.app + 'fonts/'));
});

gulp.task('styles', function() {
  return gulp.src(paths.app + '**/*.css').pipe(gulp.dest(paths.dist));
});

gulp.task('server', ['watch', 'js', 'fonts'], function() {
  browserSync({
     server: {
        baseDir: paths.app
     },
     port: 9000
  });
    gulp.watch(paths.views + '**/*.html', { interval: 500 }).on("change", reload);
});

gulp.task('watch', function() {
  env = env || 'dev';
  gulp.start('getVersion');
  gulp.watch([paths.src + '**/*.js', paths.src + 'directives/**/*.html'], { interval: 500 }, ['js']);
});

gulp.task('build', ['clean', 'copy', 'getVersion'], function() {
  return gulp.start('usemin');
});

gulp.task('usemin', ['images', 'js'], function() {
  return gulp.src(paths.app + '{,views/**/}*.html').pipe(usemin({
    css: [prefix.apply(), minifyCss({root: paths.app}), replace(/\/styles\/bootstrap\/([a-zA-Z\-_\.0-9]*\.(woff|eot|ttf|svg))/g, '/fonts/$1'), 'concat', rev()],
    html: [
      minifyHtml({
        empty: true,
        conditionals: true
      })
    ],
    js: [
        replace(/http:\/\/localhost:5000\//g, ''),
        ngAnnotate(),
        uglify({mangle: false}),
        'concat',
        rev()]
  })).pipe(gulp.dest(paths.dist));
});

gulp.task('default', function() {
  return gulp.start('build');
});
