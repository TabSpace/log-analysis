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
			objs.view[action]('exportConfig', proxy('saveConfig'));
			objs.view[action]('importConfig', proxy('loadConfig'));
		},
		//重置配置文件
		resetConfig : function(){
			var allPipeNames = $pipelist.keys();
			var allDiagramNames = $diagramlist.keys();

			allDiagramNames.forEach(function(name){
				$channel.trigger('remove-diagram', name);
			});
			allPipeNames.forEach(function(name){
				$channel.trigger('remove-pipe', name);
			});
		},
		//保存配置文件
		saveConfig : function(fileName){
			if(!fileName){return;}

			var config = {};
			config.pipelist = $pipelist.getConf();
			config.diagramlist = $diagramlist.getConf();

			var strConfig = JSON.stringify(config);
			var blob = new Blob([strConfig], {
				type: "application/json;charset=UTF-8"
			});
			$saveAs(blob, fileName);
		},
		//加载配置文件
		loadConfig : function(blob){
			var that = this;
			if(blob && blob.size){
				var reader = new FileReader();
				reader.readAsText(blob);
				reader.onload = function(){
					var strConfig = reader.result;
					that.setConfig(strConfig);
				};
			}
		},
		//配置配置文件
		setConfig : function(strConfig){
			var config = {};
			try{
				config = JSON.parse(strConfig);
			}catch(e){
				console.error('resetConfig error:', e.message);
				return;
			}
			console.log(config);
		}
	});

	module.exports = ControlPanel;

});

