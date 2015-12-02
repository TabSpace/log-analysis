var $fs = require('fs');
var $path = require('path');

module.exports = function(grunt){

	//扩展一个对象
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

	//获取配置文件
	var getConfigFiles = function(configPath){
		var configFiles = [];
		if(grunt.file.isFile){
			configFiles.push(
				$path.resolve(__dirname, configPath)
			);
		}else{
			grunt.file.recurse(configPath, function(abspath, rootdir, subdir, filename){
				configFiles.push(abspath);
			});
		}

		return configFiles.filter(function(path){
			var fileName = $path.basename(path);
			return $path.extname(fileName) === '.json';
		});
	};

	var outputViewFile = function(options){
		options = options || {};
		var configPath = options.configPath;

		grunt.log.writeln();
		grunt.log.writeln('Generate diagram file from ' + configPath + ' :');

		if(!configPath){
			grunt.log.errorlns('Missing configPath!', options);
			return;
		}

		var srcPath = options.srcPath || '';
		if(srcPath){
			grunt.log.writeln('Assign srcPath to: ' + srcPath);
		}else{
			grunt.log.errorlns('Missing srcPath!');
			return;
		}

		var inputPath = options.inputPath;
		if(!inputPath){
			grunt.log.errorlns('Missing inputPath!', options);
			return;
		}

		var outputPath = options.outputPath;
		if(!outputPath){
			grunt.log.errorlns('Missing outputPath!', options);
			return;
		}

		var templatePath = options.templatePath;
		if(!templatePath){
			grunt.log.errorlns('Missing templatePath!', options);
			return;
		}

		var config = grunt.file.readJSON(configPath);

		if(!Array.isArray(config.sources) || !config.sources.length){
			grunt.log.errorlns('Missing source data.');
			return;
		}

		if(!config.common){
			grunt.log.errorlns('Missing common data.');
			return;
		}

		if(!config.pipelist){
			grunt.log.errorlns('Missing pipelist data.');
			return;
		}

		if(!config.diagramlist){
			grunt.log.errorlns('Missing diagramlist data.');
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
				var t1 = new Date();
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

					grunt.log.writeln([
						'[name:' + name + ']',
						'[type:' + (Array.isArray(conf.data) ?
							'array length ' + conf.data.length :
							'object'
						) + ']',
						'[time:' + (new Date() - t1) + 'ms]'
					].join(' '));
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
		grunt.log.writeln('\nGenerate pipe data:');
		Object.keys(pipelist).forEach(function(name){
			prepareData(name);
		});

		//处理图表
		grunt.log.writeln('\nGenerate diagram data:');
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
		'logAnalysis',
		'generate diagrams',
		function(){
			var done = this.async();

			var queue = [];
			var conf = this.options();
			var data = this.data;

			var that = this;
			var targetPath = data.path;
			var modulePath = $path.resolve(__dirname, '../');

			var configFiles = getConfigFiles(targetPath);

			configFiles.forEach(function(configPath){
				var configDir = $path.dirname(configPath);
				outputViewFile({
					configPath : configPath,
					srcPath : $path.relative(configDir, $path.join(modulePath, 'src')),
					inputPath : configDir,
					outputPath : configDir,
					templatePath : $path.join(modulePath, 'src/template/template.html')
				});
			});

			done();

		}
	);
};



