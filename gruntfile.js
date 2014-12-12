var $path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		generateDiagram : {
			options: {},
			test : {
				path : $path.resolve(__dirname, 'test')
			}
		}
	});

	grunt.loadTasks('tasks');

	grunt.registerTask(
		'default',
		'the default task',
		[
			'generateDiagram'
		]
	);

};


