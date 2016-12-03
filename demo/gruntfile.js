var $path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		logAnalysis : {
			demo : {
				src : 'index.json'
			}
		}
	});

	grunt.loadNpmTasks('log-analysis');

	grunt.registerTask(
		'default',
		'the default task',
		[
			'logAnalysis'
		]
	);

};


