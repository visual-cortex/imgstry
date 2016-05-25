var gulp        = require("gulp"),
    browserify  = require("browserify"),
    source      = require("vinyl-source-stream"),
    buffer      = require("vinyl-buffer"),
    tslint      = require("gulp-tslint"),
    tsc         = require("gulp-typescript"),
    sourcemaps  = require("gulp-sourcemaps"),
    uglify      = require("gulp-uglify"),
    runSequence = require("run-sequence"),
    mocha       = require("gulp-mocha"),
    istanbul    = require("gulp-istanbul");
    
gulp.task("lint", function() {
    return gulp.src([
        "source/**/**.ts",
        "test/**/**.test.ts"
    ])
    .pipe(tslint({ }))
    .pipe(tslint.report("verbose"));
});

var tsProject = tsc.createProject("tsconfig.json");

gulp.task("build", function() {
    return gulp.src([
            "source/**/**.ts"
        ])
        .pipe(tsc(tsProject))
        .js.pipe(gulp.dest("source/"));
});

gulp.task("bundle", function() {

    var libraryName = "imgstry";
    var mainTsFilePath = "source/imgstry.js";
    var outputFolder   = "dist/";
    var outputFileName = libraryName + ".min.js";

    var bundler = browserify({
        debug: true,
        standalone : libraryName
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

gulp.task("watch", function () {
    gulp.watch([ "source/**/**.ts", "test/**/*.ts"], ["build"]);
});

gulp.task("default", ["build", "bundle"]);