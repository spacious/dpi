//
// Gulp is used for:
//
//  - running a local server (with live reload)
//  - performing the actual build commands of the static site generator
//
// Notes:
//
//  - True, many static site generators do have server and live reload plugins, but gulp's actually work consistently
//  - Metalsmith has a [gulpsmith](https://github.com/pjeby/gulpsmith) plugin to use each others plugins interchangeably
//
var gulp = require('gulp');
var connect = require('gulp-connect');
var gutil = require('gulp-util');
var ghPages = require('gulp-gh-pages');

var chalk = require('chalk');
var mkdirp = require('mkdirp');

var argv = require('yargs').options('r', {
    alias: 'reload',
    boolean: true,
    describe: 'Use live reload',
    "default": true
  }).strict().argv;

var buildMetalsmith = require('./scripts/build-metalsmith').build;

// Return value of connect.server() or null
var server;

// Config for connect.server()
var serverConf = {
    root: 'build',
    livereload: argv.r
};

// Files to deploy to github pages
var deployPath = './build/**/*';

// Paths for built files, used for live-reloading
var buildPaths = ['./build/**','!./*/'];

// Paths for source files, used for watching
var sourcePaths = ['./+(src|assets|templates)/**','!./*/','./matter.json'];

// Tasks ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Generic Build
gulp.task('build', ['build-metalsmith'], function() {});

// Launch Server
gulp.task('connect', function() {

    server = connect.server(serverConf);
});

// Default
gulp.task('default', ['build','connect','watch']);

// Deploy
gulp.task('deploy', function() {

    return gulp.src(deployPath)
    .pipe(ghPages());
});

// Post Build
gulp.task('post-build', function() {

    if(server && serverConf.livereload){

        gutil.log(chalk.green("Reloading..."));
        gulp.src(buildPaths).pipe(connect.reload());
    }
});

// Watch source for changes and start build task
gulp.task('watch', function() {

    gulp.watch(sourcePaths,function(v){

        gutil.log(chalk.magenta(v.type+' '+ v.path));

        gulp.start('build');
    });
});

// Builders ////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Metalsmith
gulp.task('build-metalsmith', function() {

    buildMetalsmith(function(err) {

        if (err) throw err;

        gutil.log(chalk.green("Metalsmith build complete"));

        gulp.start('post-build');
    });
});