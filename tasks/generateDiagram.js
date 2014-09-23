var $fs = require('fs');
var $path = require('path');

module.exports = function(grunt){

	grunt.registerMultiTask(
		'generateDiagram',
		'generate diagrams',
		function(){
			var done = this.async();

			var queue = [];
			var conf = this.options();
			var data = this.data;

			console.log('conf:', conf, 'data:', data);

		}
	);
};



