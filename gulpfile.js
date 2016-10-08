var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    tslint = require('gulp-tslint'),
    tsc = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    foreach = require('gulp-foreach'),
    runSequence = require('run-sequence'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    merge = require('merge2'),
    del = require('del');

gulp.task('lint:ts', function () {
    return gulp.src([
        'source/**/**.ts',
        'test/**/**.test.ts'
    ])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

var tsProject = tsc.createProject('tsconfig.json');

gulp.task('build:ts', ['lint:ts'], function () {
    var result = gulp.src([
        'source/**/**.ts'
    ])
        .pipe(tsProject());
    return merge([
        result.js.pipe(gulp.dest('source/')),
        result.js.pipe(gulp.dest('dist/js')),
        result.dts.pipe(gulp.dest('dist/typings'))
    ]);
});

gulp.task('build', ['build:ts'], function () {

    var libraryName = 'imgstry';
    var mainTsFilePath = 'imgstry.js';
    var outputFolder = 'dist/';
    var outputFileName = libraryName + '.min.js';

    var bundler = browserify({
        debug: true,
        standalone: libraryName,
        basedir: './source'
    });

    return bundler.add(mainTsFilePath)
        .bundle()
        .pipe(source(outputFileName))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(outputFolder));
});

gulp.task('watch', function () {
    gulp.watch(['source/**/**.ts', 'test/**/*.ts'], ['build']);
});

var tsTestProject = tsc.createProject('tsconfig.json');

gulp.task('build:test-integration', function () {
    return gulp.src([
        'test/integration/**/*.test.ts',
        'test/integration/**/constants/*.ts'
    ])
        .pipe(tsTestProject())
        .js.pipe(gulp.dest('test/integration'));
});

gulp.task('build:test-client', function () {
    return gulp.src([
        'test/client/*.test.ts'
    ])
        .pipe(tsTestProject())
        .js.pipe(gulp.dest('test/client'));
});

gulp.task('test:istanbul-hook', function () {
    return gulp.src(['source/**/*.js'])
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('test:phantomjs', function () {
    var phantomResultDir = 'reports/client';
    var testDumpPath = 'test-results-' + (new Date()).getTime() + '.json';

    return gulp
        .src('test/runner.html')
        .pipe(mochaPhantomJS({
            reporter: 'json',
            dump: testDumpPath
        })).on('finish', () => {
            gulp.src(testDumpPath)
                .pipe(gulp.dest(phantomResultDir)).on('finish', () => {
                    del(testDumpPath);
                });
        });
});

gulp.task('test:pack', function (callback) {
    runSequence('build:test-integration', 'build:test-client', ['test:phantomjs', 'test:istanbul-hook'], callback);
})

gulp.task('test', ['test:pack'], function () {
    return gulp.src('test/integration/*.js')
        .pipe(mocha({
            ui: 'bdd',
            reporter: 'mochawesome',
            reporterOptions: {
                reportDir: 'reports/integration/',
                reportTitle: 'Imgstry integration test results',
                inlineAssets: true
            }
        }))
        .pipe(istanbul.writeReports({
            dir: 'reports/integration/coverage'
        }));
});

gulp.task('default', ['build', 'bundle']);
