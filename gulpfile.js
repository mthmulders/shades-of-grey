const { dest, parallel, series, src, watch } = require('gulp');

const _browserSync = require('browser-sync').create();
const del = require('del');
const log = require('fancy-log');
const rename = require('gulp-rename');

const browserSync = (cb) => {
    const options = {
        server: {
            baseDir: './build'
        }
    };
    _browserSync.init(options, cb);
};

const clean = (cb) => {
    const patterns = [
        'build/**/*',
        '!preview/reveal.css',
        '!preview/print/paper.css',
        '!preview/lib/tomorrow-night-blue.css',
    ];
    del(patterns).then(r => cb());
};

const css = (cb) => {
    const postcss    = require('gulp-postcss')
    const sourcemaps = require('gulp-sourcemaps')
  
    return src('src/**/*.css')
      .pipe(sourcemaps.init() )
      .pipe(postcss())
      .pipe(sourcemaps.write('.'))
      .pipe(rename('shades-of-grey.css'))
      .pipe(dest('build/'))
};

const copyFonts = (cb) => {
    return src('./fonts/**/*').pipe(dest('./build/fonts/'));
};

const copyImages = (cb) => {
    return src('./img/**/*').pipe(dest('./build/img/'));
};

const copyPreview = (cb) => {
    return src('./preview/**/*')
        .pipe(dest('./build/'))
        .pipe(_browserSync.reload({ stream: true }));
};

//
// User tasks
//

const dev = series(clean, copyPreview, browserSync, parallel(copyFonts, copyImages, css), () => {
    log.info('Registering watch tasks...');
    watch('preview/**/*', copyPreview);
    watch('src/**/*.css', css); 
    watch('src/fonts/**/*', copyFonts);
    watch('src/img/**/*', copyImages);
});

const build = series(clean, parallel(copyFonts, copyImages, css), () => {
    const files = [
        './package.json',
        './LICENSE',
        './README.MD',
    ];
    return src(files).pipe(dest('./build/'));
});

exports.build = build;
exports.dev = dev;

if (process.env.NODE_ENV === 'production') {
    exports.default = dev;
} else {
    exports.default = build;
}
