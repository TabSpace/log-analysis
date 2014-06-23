/**
 * @fileoverview 数据列表
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/ctrl/dataPanel',function(require,exports,module){

	var $controller = require('lib/mvc/controller');
	var $dataView = require('mods/view/dataPanel');

	var DataPanel = $controller.extend({
		defaults : {
			data : null,
			stage : null,
			parent : null
		},
		build : function(){
			var conf = this.conf;
			var objs = this.objs;
			objs.view = new $dataView({
				data : conf.data,
				stage : conf.stage,
				parent : conf.parent
			});
		}
	});

	module.exports = DataPanel;

});

