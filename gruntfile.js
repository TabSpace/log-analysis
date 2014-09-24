var $path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		basePath : $path.resolve(__dirname,'./'),
		pkg: grunt.file.readJSON('package.json'),
		generateDiagram : {
			options: {},
			demo : {
				'srcPath' : '../src/',
				'configPath' : '<%=basePath%>/demo',
				'inputPath' : '<%=basePath%>/demo',
				'outputPath' : '<%=basePath%>/demo',
				'templatePath' : '<%=basePath%>/src/template/template.html'
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask(
		'default',
		'the default task',
		[
			'generateDiagram'
		]
	);

};


