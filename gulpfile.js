// modules
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync').create();

const autoprefixerList = [
	'Chrome >= 45',
	'Firefox ESR',
	'Edge >= 12',
	'Explorer >= 10',
	'iOS >= 9',
	'Safari >= 9',
	'Android >= 4.4',
	'Opera >= 30'
];

// pug to html
const buildTemplate = () => {
	return gulp.src(['src/*.pug'])
		.pipe(sourcemap.init())
		.pipe(pug({
			pretty: true
		}))
		.pipe(sourcemap.write())
		.pipe(gulp.dest('build/'))
		.pipe(sync.stream());
}
exports.buildTemplate = buildTemplate;

// scss to css
const createCss = () => {
	return gulp.src("src/scss/**/*")
		.pipe(plumber(function (err) {
			console.log("Styles Task Error");
			console.log(err);
			this.emit("end");
		}))
		.pipe(sourcemap.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
				overrideBrowserslist: autoprefixerList,
				cascade: false,
				grid: true
		}))
		.pipe(sourcemap.write("."))
		.pipe(gulp.dest("build/css/"))
		.pipe(sync.stream());
}
exports.createCss = createCss;

// img
const images = () => {
	return gulp.src("src/images/**")
		.pipe(sourcemap.init())
		.pipe(gulp.dest("build/images/"))
		.pipe(sync.stream());
}
exports.images = images;

// JS 
const scripts = () => {
	return gulp.src("src/js/*")
		.pipe(sourcemap.init())
		.pipe(gulp.dest("build/js/"))
		.pipe(sync.stream());
}
exports.scripts = scripts;

// fonts  
const fonts = () => {
	return gulp.src("src/fonts/*")
		.pipe(sourcemap.init())
		.pipe(gulp.dest("build/fonts/"))
		.pipe(sync.stream());
}
exports.fonts = fonts;

// server
const server = (done) => {
	sync.init({
		server: {
			baseDir: 'build'
		},
		cors: true,
		notify: false,
		ui: false,
	});
	done();
}
exports.server = server;

// watcher
const watch = () => {
	gulp.watch('src/js/*', gulp.series("scripts"));
	gulp.watch('src/images/*', gulp.series("images"));
	gulp.watch('src/fonts/*', gulp.series("fonts"));
	gulp.watch('src/scss/**/*', gulp.series("createCss"));
	gulp.watch('src/**/*.pug', gulp.series("buildTemplate"));
}

// gulp watch
exports.watch = watch;

// gulp build/default
exports.default = gulp.series(
	buildTemplate, createCss, scripts, images, fonts, server, watch
);

// gulp develop
exports.dev = gulp.series(
	server, watch
);