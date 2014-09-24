var $fs = require('fs');
var $path = require('path');

module.exports = function(grunt){

	var append = function(){
		var args = Array.prototype.slice.call(arguments);
		original = args.shift() || {};
		args.forEach(function(object){
			object = object || {};
			for(var key in object){
				if(object.hasOwnProperty(key)){
					original[key] = object[key];
				}
			}
		});
		return original;
	};

	//简单模板函数
	var substitute = function(str, o, regexp) {
		return str.replace(regexp || (/\\?\{\{([^{}]+)\}\}/g), function(match, name) {
			if (match.charAt(0) === '\\') {
				return match.slice(1);
			}
			return (o[name] === undefined) ? '': o[name];
		});
	};

	var getConfigFiles = function(configPath){
		var configFiles = [];
		grunt.file.recurse(configPath, function(abspath, rootdir, subdir, filename){
			configFiles.push(abspath);
		});
		return configFiles.filter(function(path){
			var fileName = $path.basename(path);
			return $path.extname(fileName) === '.json';
		});
	};

	var outputViewFile = function(options){
		options = options || {};
		var taskName = options.taskName || '';
		grunt.log.writeln('Task ' + taskName + ' start:');

		var configPath = options.configPath;
		if(!configPath){
			grunt.log.errorlns('Task ' + taskName + ' need configPath!', options);
			return;
		}

		var srcPath = options.srcPath || '../';
		grunt.log.writeln('Task ' + taskName + ' assign srcPath to: ' + srcPath);

		var inputPath = options.inputPath;
		if(!inputPath){
			grunt.log.errorlns('Task ' + taskName + ' need inputPath!', options);
			return;
		}

		var outputPath = options.outputPath;
		if(!outputPath){
			grunt.log.errorlns('Task ' + taskName + ' need outputPath!', options);
			return;
		}

		var templatePath = options.templatePath;
		if(!templatePath){
			grunt.log.errorlns('Task ' + taskName + ' need templatePath!', options);
			return;
		}

		var config = grunt.file.readJSON(configPath);
		if(!Array.isArray(config.sources) || !config.sources.length){
			grunt.log.errorlns('There is no source data.');
			return;
		}

		//准备一个递归树来存储数据
		var tree = {};

		//读取源数据
		config.sources.forEach(function(path){
			var fileName = path.split(/[\\\/]/).pop();
			var filePath = $path.join(inputPath, fileName);
			var text = grunt.file.read(filePath, {
				encoding : 'utf-8'
			});
			var list = text.split(/[\r\n]/);
			tree[path] = {
				type : 'source',
				name : path,
				data : list
			};
		});

		var pipelist = config.pipelist;

		//计算过滤器的最终数据
		var compute = function(conf){
			var name = conf.name;
			var source = conf.source;
			var filter = conf.filter;

			if(source && filter){
				var code = [];
				var args = [];
				Object.keys(source).forEach(function(valName, index){
					var sourceName = source[valName];
					code.push('var ' + valName + ' = arguments[' + index + '];');
					
					//递归方式生成过滤器数据
					prepareData(sourceName);

					var sourceConf = tree[sourceName];
					if(sourceConf && sourceConf.data){
						args.push(sourceConf.data);
					}else{
						args.push(null);
					}
				});

				code = code.join('\n') + '\n';
				code = code + filter;

				try{
					var fn = new Function(code);
					conf.data = fn.apply(null, args);
					grunt.log.writeln(
						name + ' compute complete:' +
						(Array.isArray(conf.data) ?
							' array length ' + conf.data.length :
							' object'
						)
					);
				}catch(e){
					grunt.log.errorlns(name + ' compute error:' + e.message);
				}
			}
		};

		var prepareData = function(name){
			var conf = tree[name] || pipelist[name] || {};
			conf.name = name;
			if(tree[name] && conf.data){
				return;
			}else{
				compute(conf);
				tree[name] = conf;
			}
		};

		//处理过滤器
		grunt.log.writeln('\n计算过滤器数据:');
		Object.keys(pipelist).forEach(function(name){
			prepareData(name);
		});

		//处理图表
		grunt.log.writeln('\n计算图表数据:');
		var diagramlist = config.diagramlist;
		Object.keys(diagramlist).forEach(function(name){
			var conf = diagramlist[name] || {};
			conf.name = name;
			compute(conf);
		});

		//准备输出的选项
		var outputConfig = {};
		outputConfig.diagramlist = diagramlist;
		outputConfig.common = config.common;

		var tplData = {};
		var fileName = config.common ? config.common.fileName : 'exports';
		tplData['CONFIG_DATA'] = JSON.stringify(outputConfig);
		tplData['SRC_PATH'] = srcPath;
		tplData['TITLE'] = fileName;
		
		grunt.log.write('\n');
		var template = grunt.file.read(templatePath, {charset : 'utf-8'});
		var html = substitute(template, tplData);
		var outputFilePath = $path.join(outputPath, fileName + '.html');

		grunt.file.write(outputFilePath, html, {
			charset : 'utf-8'
		});
		grunt.log.writeln('Diagram file output to : ' + outputFilePath);
	};

	grunt.registerMultiTask(
		'generateDiagram',
		'generate diagrams',
		function(){
			var done = this.async();

			var queue = [];
			var conf = this.options();
			var data = this.data;

			var that = this;

			var configFiles = getConfigFiles(data.configPath);

			configFiles.forEach(function(configPath){
				outputViewFile({
					taskName : that.target,
					configPath : configPath,
					srcPath : data.srcPath,
					inputPath : data.inputPath,
					outputPath : data.outputPath,
					templatePath : data.templatePath
				});
			});

			done();

		}
	);
};



