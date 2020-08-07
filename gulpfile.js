let project_folder = "build";
let src_folder = "#src";
let {src, dest} = require('gulp');
let path = {
    build: {
        html: project_folder+"/",
        css: project_folder+"/css",
        js: project_folder+"/js",
        img: project_folder+"/img",
        fonts: project_folder+"/fonts",
    },

    src:{
        html: [src_folder+"/*.html","!"+src_folder+"/_*.html"],
        css: src_folder+"/scss/style.scss",
        js: src_folder+"/js/*.js",
        img: src_folder+"/img/**/*.{jpg,png,webp,ico,svg,gif}",
        fonts: src_folder+"/fonts/*.ttf",
    },

    watch: {
        html: src_folder+"/**/*.html",
        css: src_folder+"/scss/**/*.scss",
        js: src_folder+"/js/**/*.js",
        img: src_folder+"/img/**/*.{jpg,png,webp,ico,svg,gif}",
        fonts: src_folder+"/fonts/*.ttf",
    },

    clean: "./"+project_folder+"/"
}

const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const del = require('del');
const fileInc = require('gulp-file-include');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const group_media = require('gulp-group-css-media-queries');
const imagemin = require('gulp-imagemin');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const concat = require('gulp-concat');


function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./"+project_folder+"/",
        },
        port: 3000,

    })
}

function html() {
    return src(path.src.html)
    .pipe(fileInc())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function style(params) {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: 'expanded',
            })
        )
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true,
        }))
        
        .pipe(group_media())
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
    .pipe(fileInc())
    // .pipe(concat('script.js'))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
    .pipe(dest(path.build.img))
    .pipe(
        imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 3
        })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function fonts() {
    src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], style);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.fonts], fonts);
}

function clean(params) {
    return del(path.clean);
}

gulp.task('otf2ttf',function name(params) {
    return src([src_folder+"/fonts/*.otf"])
    .pipe(fonter({
        formats: ['ttf']
    }))
    .pipe(dest(src_folder+'/fonts/'))
})

gulp.task('svgSprite', function name(params) {
    return src(src_folder+'/img/icons/*.svg')
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
            }
        }))
        .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
        mode: {
            symbol: {
                sprite: "../icons/icons.svg",
            }
        }
    }))

    .pipe(dest(path.build.img))
});

let build = gulp.series(clean, gulp.parallel(html, style, js, images, fonts));
let watch = gulp.parallel(build, browserSync, watchFiles);

exports.html = html;
exports.css = style;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
exports.default = watch;
