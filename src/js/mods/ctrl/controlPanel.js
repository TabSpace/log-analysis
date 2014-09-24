/**
 * @fileoverview 控制面板
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/ctrl/controlPanel',function(require,exports,module){

	var $controller = require('lib/mvc/controller');
	var $controlView = require('mods/view/controlPanel');
	var $pipelist = require('mods/model/pipelist');
	var $diagramlist = require('mods/model/diagramlist');
	var $saveAs = require('vendor/saveAs');
	var $tip = require('mods/dialog/tip');
	var $channel = require('mods/channel/global');
	var $config = require('mods/model/config');
	var $root = require('mods/model/root');

	var ControlPanel = $controller.extend({
		defaults : {
			parent : null
		},
		build : function(){
			var conf = this.conf;
			var objs = this.objs;
			objs.view = new $controlView({
				parent : conf.parent
			});
		},
		setEvents : function(action){
			var proxy = this.proxy();
			var objs = this.objs;
			this.delegate(action);
			objs.view[action]('resetConfig', proxy('resetConfig'));
			objs.view[action]('logConfig', proxy('logConfig'));
			objs.view[action]('exportConfig', proxy('saveConfig'));
			objs.view[action]('importConfig', proxy('loadConfig'));
		},
		//重置配置文件
		resetConfig : function(){
			var allPipeNames = $pipelist.keys();
			var allDiagramNames = $diagramlist.keys();

			$config.clear();
			allDiagramNames.forEach(function(name){
				$channel.trigger('remove-diagram', name);
			});
			allPipeNames.forEach(function(name){
				$channel.trigger('remove-pipe', name);
			});
		},
		//获取总配置信息
		getConfig : function(){
			var config = {};
			config.common = $config.get();
			config.sources = $root.keys();
			config.pipelist = $pipelist.getConf();
			config.diagramlist = $diagramlist.getConf();
			return config;
		},
		//保存配置文件
		saveConfig : function(fileName){
			if(!fileName){return;}
			$config.set('fileName', fileName);

			var config = this.getConfig();
			console.info('Save config:', config);

			var strConfig = JSON.stringify(config);
			var blob = new Blob([strConfig], {
				type: "application/json;charset=UTF-8"
			});
			$saveAs(blob, fileName + '.json');
		},
		//将配置信息输出到控制台
		logConfig : function(){
			var config = this.getConfig();
			$tip('配置信息已输出到控制台，请打开控制台查看');
			console.info(config);
		},
		//加载配置文件
		loadConfig : function(config){
			this.resetConfig();
			$channel.trigger('switch-tab-to', 'data');

			console.info('Load config:', config);

			if($.isPlainObject(config.common)){
				$config.set(config.common);
			}
			
			if($.isPlainObject(config.pipelist)){
				setTimeout(function(){
					$channel.trigger('load-pipes', config.pipelist);
				});
			}

			if($.isPlainObject(config.diagramlist)){
				setTimeout(function(){
					$channel.trigger('load-diagrams', config.diagramlist);
				});
			}
		}
	});

	module.exports = ControlPanel;

});

