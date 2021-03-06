var $path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy : {
			test : {
				files : [
					{
						expand : true,
						cwd : 'test',
						src : 'mobilelog.json',
						dest : 'test/demo/demo1/'
					},
					{
						expand : true,
						cwd : 'test',
						src : 'mobilelog.json',
						dest : 'test/demo/demo2/'
					}
				]
			}
		},
		logAnalysis : {
			options: {
				staticFilePath: 'src'
			},
			test : {
				src: ['test/demo/**/mobilelog.json']
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask(
		'default',
		'the default task',
		[
			'copy:test',
			'logAnalysis'
		]
	);

};


