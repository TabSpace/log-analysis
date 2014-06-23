/**
 * @fileoverview 数据列表
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/ctrl/dataPanel',function(require,exports,module){

	var $controller = require('lib/mvc/controller');
	var $dataView = require('mods/view/dataPanel');
	var $root = require('mods/model/root');
	var $config = require('mods/model/config');

	var DataPanel = $controller.extend({
		defaults : {
			parent : null
		},
		build : function(){
			var conf = this.conf;
			var objs = this.objs;
			objs.view = new $dataView({
				parent : conf.parent
			});
		},
		setEvents : function(action){
			var objs = this.objs;
			var proxy = this.proxy();
			this.delegate(action);
			objs.view[action]('addDataSource', proxy('addDataSource'));
		},
		addDataSource : function(path){
			path = $config.get('dataPath') + path;
			$root.addData(path);
		}
	});

	module.exports = DataPanel;

});

