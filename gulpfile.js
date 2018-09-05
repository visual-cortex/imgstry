const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const tslint = require('gulp-tslint');
const tsc = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const mocha = require('gulp-mocha');
const mochaPhantomJS = require('gulp-mocha-phantomjs');
const merge = require('merge2');
const del = require('del');

gulp.task('lint:ts', () => {
    return gulp.src([
        'source/**/**.ts',
        'test/**/**.test.ts'
    ])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task('build:ts', () => {
    const tsProject = tsc.createProject('tsconfig.json');
    const result = gulp.src([
        'source/**/**.ts'
    ])
        .pipe(tsProject());
    return merge([
        result.js.pipe(gulp.dest('dist/js')),
        result.dts.pipe(gulp.dest('dist/js'))
    ]);
});

gulp.task('build:bundle', () => {
    const libraryName = 'imgstry';
    const mainTsFilePath = 'index.js';
    const outputFolder = 'dist/';
    const outputFileName = libraryName + '.min.js';

    const bundler = browserify({
        debug: true,
        standalone: libraryName,
        basedir: './dist/js'
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

gulp.task('build', gulp.series(
    'lint:ts',
    'build:ts',
    'build:bundle'
));

gulp.task('watch', () => {
    gulp.watch(['source/**/**.ts', 'test/**/*.ts'], gulp.series('build'));
});

gulp.task('build:test-integration', () => {
    const tsProject = tsc.createProject('tsconfig.json');

    return gulp.src([
        'test/integration/**/*.test.ts',
        'test/integration/**/constants/*.ts'
    ])
        .pipe(tsProject())
        .js.pipe(gulp.dest('test/integration'));
});

gulp.task('build:test-client', () => {
    const tsProject = tsc.createProject('tsconfig.json');

    return gulp.src([
        'test/client/*.test.ts'
    ])
        .pipe(tsProject())
        .js.pipe(gulp.dest('test/client'));
});

gulp.task('test:phantomjs', () => {
    const phantomResultDir = 'reports/client';
    const reportPath = 'test-results-' + (new Date()).getTime() + '.json';

    return gulp
        .src('test/runner.html')
        .pipe(mochaPhantomJS({
            reporter: 'nyan',
            dump: reportPath
        })).on('finish', () => {
            gulp.src(reportPath)
                .pipe(gulp.dest(phantomResultDir)).on('finish', () => {
                    del(reportPath);
                });
        }).on('error', () => {
            del(reportPath);
        });
});

gulp.task('test:unit', () => {
    return gulp.src('test/integration/*.js')
        .pipe(mocha({
            ui: 'bdd',
            reporter: 'mochawesome',
            reporterOptions: {
                reportDir: 'reports/integration/',
                reportTitle: 'Imgstry integration test results',
                inlineAssets: true
            }
        }));
});

gulp.task('test', gulp.series(
    'build',
    'build:test-integration',
    'build:test-client',
    'test:phantomjs',
    'test:unit'
));

gulp.task('default', gulp.series('build'));
