var $fs = require('fs');
var $path = require('path');
var $outputView = require('../lib/outputView');

module.exports = function(grunt){

	grunt.registerMultiTask(
		'logAnalysis',
		'generate diagrams',
		function(){

			var queue = [];
			var conf = this.options();
			var data = this.data;

			console.log(conf, data);


			var files = [];

			this.files.forEach(function(file) {

				file.src.forEach(function(filepath) {
					// Remove nonexistent files (it's up to you to filter or warn here).
					if (!grunt.file.exists(filepath)) {
						grunt.log.warn('Source file "' + filepath + '" not found.');
					} else {
						files.push(filepath);
					}
				});

			});

			var gruntFileRoot = process.cwd();
			var staticFilePath = '';

			if(conf.staticFilePath){
				staticFilePath = $path.join(gruntFileRoot, conf.staticFilePath);
			}else{
				staticFilePath = $path.join(gruntFileRoot, 'node_modules/log-analysis/src');
			}

			files.forEach(function(file){
				var configPath = $path.join(gruntFileRoot, file);
				var srcPath = $path.relative($path.dirname(configPath), staticFilePath);
				var inputPath = $path.dirname(configPath);
				var outputPath = $path.dirname(configPath);
				var templatePath = $path.join(staticFilePath, 'template/template.html');

				$outputView({
					configPath : configPath,
					srcPath : srcPath,
					inputPath : inputPath,
					outputPath : outputPath,
					templatePath : templatePath
				}, grunt);
			});

		}
	);
};



