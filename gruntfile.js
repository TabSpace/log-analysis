var $path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		basePath : $path.resolve(__dirname,'../'),
		pkg: grunt.file.readJSON('package.json'),
		generateDiagram : {
			options: {
				cwd: '<%=basePath%>'
			},
			demo : {

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


