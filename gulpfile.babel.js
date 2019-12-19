import gulp from 'gulp';
import less from 'gulp-less';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import del from 'del';
import typescript from 'typescript';

let distDir = "dist/cplayer/";
const paths = {
    packageJson: {
        src: 'package.json',
        dest: distDir
    },
    styles: {
        src: 'src/css/**/*.css',
        dest: distDir + 'css/'
    },
    scripts: {
        src: 'src/audio/**/*.js',
        dest: distDir + 'js/'
    },
    ngstyle: {
        src: 'src/*.scss',
        dest: distDir
    },
    ngscripts: {
        src: 'src/*.ts',
        dest: distDir
    },


};

/*
 * For small tasks you can export arrow functions
 */
const clean = () => del(['dist']);



function copyPackageInfo() {
    return gulp.src(paths.packageJson.src)
        .pipe(gulp.dest(paths.packageJson.dest));
}

/*
 * You can also declare named functions and export them as tasks
 */
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(concat('cplayer.min.css'))
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('cplayer.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}


function angularSupport() {
    return gulp.src(paths.ngscripts.src)
        // .pipe(rename('cplayer.d.ts'))
        .pipe(gulp.dest(paths.ngscripts.dest));
}

function angularStyle() {
    return gulp.src(paths.ngstyle.src)
        .pipe(gulp.dest(paths.ngstyle.dest));
}

/*
 * You could even use `export as` to rename exported tasks
 */
function watchFiles() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
}
export { watchFiles as watch };

gulp.task('clean', clean);

gulp.task('ng', gulp.series(angularStyle, angularSupport));


const build = gulp.series(clean, gulp.series(copyPackageInfo, styles, scripts, angularStyle, angularSupport));

/*
 * Export a default task
 */
export default build;