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
const browserSync = require('browser-sync').create();

const path = {
    dist: {
        base: 'dist/',
        js: `dist/js/`,
        entrypoint: 'index.js'
    },
    library: {
        browser: {
            name: 'imgstry',
            fileName: 'imgstry.browser',
            base: 'browser'
        },
        worker: {
            name: 'imgstry',
            fileName: 'imgstry.worker',
            base: 'browser/worker'
        }
    },
    source: {
        base: 'source/',
        ts: 'source/**/**.ts'
    },
    test: {
        base: 'test/',
        ts: 'test/**/**.test.ts',
        unit: {
            base: 'test/unit/',
            ts: 'test/unit/**/*.ts',
            js: 'test/unit/**/*.js'
        },
        e2e: {
            base: 'test/end-to-end',
            entrypoint: 'test/end-to-end/index.html',
            ts: 'test/end-to-end/**/*.ts',
            js: 'test/end-to-end/**/*.js'
        },
        reports: {
            base: 'reports/',
            e2e: 'reports/end-to-end/',
            unit: 'reports/unit/'
        }
    }
};

gulp.task('lint:ts', () => {
    return gulp.src([
        path.source.ts,
        path.test.ts
    ])
        .pipe(tslint({
            formatter: 'verbose'
        }))
        .pipe(tslint.report())
});

gulp.task('build:ts', () => {
    const tsProject = tsc.createProject('tsconfig.json');
    const result = gulp.src([
        path.source.ts
    ])
        .pipe(tsProject());
    return merge([
        result.js.pipe(gulp.dest(path.dist.js)),
        result.dts.pipe(gulp.dest(path.dist.js))
    ]);
});

const bundle = (library) => {
    return () => {
        const outputFileName = library.fileName + '.min.js';

        const bundler = browserify({
            debug: true,
            standalone: library.name,
            basedir: `${path.dist.js}${library.base}`
        });

        return bundler.add(path.dist.entrypoint)
            .bundle()
            .pipe(source(outputFileName))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(path.dist.base))
            .pipe(browserSync.stream());
    }
}

gulp.task('build:browser:bundle', bundle(path.library.browser));
gulp.task('build:worker:bundle', bundle(path.library.worker));

gulp.task('build:clean', () => {
    return del(path.dist.base);
});

gulp.task('build', gulp.series(
    'build:clean',
    'lint:ts',
    'build:ts',
    'build:browser:bundle',
    'build:worker:bundle'
));

gulp.task('watch', gulp.series('build', () => {
    browserSync.init({
        server: {
            baseDir: './',
            index: path.test.e2e.entrypoint
        },
        serveStatic: [{
            route: 'resources/rnm.jpg',
            dir: 'test/end-to-end/resources/rnm.jpg'
        }]
    });
    gulp.watch([path.source.ts], gulp.series('build:ts', 'build:browser:bundle', 'build:worker:bundle'));
    gulp.watch([path.test.e2e.ts], gulp.series('test:e2e:build'));
}));

gulp.task('test:clean', () => {
    return del([
        path.test.reports.base,
        `${path.test.e2e.js}!helpers/**/*.js`,
        path.test.unit.js
    ])
});

gulp.task('test:unit:build', () => {
    const tsProject = tsc.createProject('tsconfig.json');

    return gulp.src(path.test.unit.ts)
        .pipe(tsProject())
        .js.pipe(gulp.dest(path.test.unit.base));
});

gulp.task('test:e2e:build', () => {
    const tsProject = tsc.createProject('tsconfig.json');

    return gulp.src(path.test.e2e.ts)
        .pipe(tsProject())
        .js
        .pipe(gulp.dest(path.test.e2e.base))
        .pipe(browserSync.stream())
});

gulp.task('test:e2e', () => {
    const today = new Date();
    const formatDate = (date) => {
        const monthLookup = [
            'January', 'February', 'March',
            'April', 'May', 'June', 'July',
            'August', 'September', 'October',
            'November', 'December'
        ];
        return `${date.getDate()}-${monthLookup[date.getMonth()]}-${date.getFullYear()}`;
    }
    const report = `test-results-${formatDate(today)}-.json`;

    return gulp
        .src(path.test.e2e.entrypoint)
        .pipe(mochaPhantomJS({
            reporter: 'nyan',
            dump: report,
            phantomjs: {
                useColors: true
            }
        })).on('finish', () => {
            gulp.src(report)
                .pipe(gulp.dest(path.test.reports.e2e)).on('finish', () => {
                    del(report);
                });
        }).on('error', () => {
            del(report);
        });
});

gulp.task('test:unit', () => {
    return gulp.src(path.test.unit.js)
        .pipe(mocha({
            ui: 'bdd',
            reporter: 'mochawesome',
            reporterOptions: {
                reportDir: path.test.reports.unit,
                reportTitle: 'Imgstry integration test results',
                inlineAssets: true
            }
        }));
});

gulp.task('test:build', gulp.series(
    'test:clean',
    'test:unit:build',
    'test:e2e:build',
))

gulp.task('test', gulp.series(
    'build',
    'test:build',
    'test:e2e',
    'test:unit'
));

gulp.task('default', gulp.series('build'));
