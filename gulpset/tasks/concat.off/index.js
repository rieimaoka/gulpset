var gulpset = require("./../../gulpset");


// @verbose
gulpset.gulp.task("concat",			function() { return gulpset.tasks.concat(); });
// @verbose
gulpset.gulp.task("concat-minify",	function() { return gulpset.tasks.concat(true); });


gulpset.confs.concat = [{
	dest: gulpset.paths.dest + "js/",
	concat: "concat.js",
	src: [
		gulpset.paths.src + "js/source1.js",
		gulpset.paths.src + "js/source2.js"
	]
}];



//----------------------------------------------------------------------------------------------------
///
var gulp = require("gulp");
var plumber = require("gulp-plumber");
var gulpif = require("gulp-if");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var stream = require("event-stream");

gulpset.tasks.concat = function(doMinify, uglifyOptions, conf) {
	if(doMinify === undefined) doMinify = false;
	conf = conf || gulpset.confs.concat || {};
	uglifyOptions = uglifyOptions || {};

	var arr = [];
	for(var i = 0, iLen = conf.length; i < iLen; i++) {
		arr.push(
			(function(i) {
				var node = conf[i];
				return gulp.src(node.src)
					.pipe(plumber())
					.pipe(gulpif(doMinify === true, uglify(uglifyOptions)))
					.pipe(concat(node.concat))
					.pipe(gulp.dest(node.dest))
					.pipe(gulpset.stream());
			})(i)
		);
	}
	return stream.merge(arr);
};
