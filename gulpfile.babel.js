import gulp from 'gulp';
import less from 'gulp-less';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import del from 'del';

const paths = {
    styles: {
        src: 'src/css/**/*.css',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/audio/**/*.js',
        dest: 'dist/js/'
    }
};

/*
 * For small tasks you can export arrow functions
 */
export const clean = () => del(['dist']);

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
    return gulp.src(paths.styles.src)
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(concat('cplayer.min.css'))
        // pass in options to the stream
        // .pipe(rename({
        //     basename: 'cplayer',
        //     suffix: '.min'
        // }))
        .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('cplayer.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}

/*
 * You could even use `export as` to rename exported tasks
 */
function watchFiles() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
}
export { watchFiles as watch };

const build = gulp.series(clean, gulp.parallel(styles, scripts));
/*
 * Export a default task
 */
export default build;