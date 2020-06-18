import gulp from "gulp";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import browserSync from "browser-sync";
import rename from "gulp-rename";
import concat from "gulp-concat";
import uglifycss from "gulp-uglifycss";
import uglifyjs from "gulp-uglify";

export function styles() {
	return gulp
		.src("./scss/*.scss")
		.pipe(sass.sync().on("error", sass.logError))
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 2 versions"],
				cascade: false
			})
		)
		.pipe(gulp.dest("./css"))
		.pipe(browserSync.stream());
}

export function minifyCss() {
	return gulp
		.src(["./css/*.css", "!.css/bundle.min.css"])
		.pipe(concat("bundle.css"))
		.pipe(
			uglifycss({
				uglyComments: true
			})
		)
		.pipe(
			rename({
				suffix: ".min"
			})
		)
		.pipe(gulp.dest("./css/"))
		.pipe(browserSync.stream());
}

export function scripts() {
	return gulp
		.src(["./js/*.js", "!./js/bundle.min.js"])
		.pipe(uglifyjs())
		.pipe(concat("bundle.min.js"))
		.pipe(gulp.dest("./js/"))
		.pipe(browserSync.stream());
}

export function watch() {
	browserSync({
		server: "./",
		open: false
	});
	gulp.watch("./scss/*.scss", styles);
	gulp.watch(["./css/*.css", "!./css/bundle.min.css"], minifyCss);
	gulp.watch(["./js/*js", "!./js/bundle.min.js"], scripts);
	gulp.watch("./**/*.html").on("change", browserSync.reload);
}

const start = gulp.series(gulp.parallel(styles, scripts), minifyCss, watch);

export default start;
