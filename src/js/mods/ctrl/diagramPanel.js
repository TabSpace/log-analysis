/**
 * @fileoverview 数据视图
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/ctrl/diagramPanel',function(require,exports,module){

	var $controller = require('lib/mvc/controller');
	var $diagramView = require('mods/view/diagramPanel');

	var DiagramPanel = $controller.extend({
		defaults : {
			data : null,
			stage : null,
			parent : null
		},
		build : function(){
			var conf = this.conf;
			var objs = this.objs;
			objs.view = new $diagramView({
				data : conf.data,
				stage : conf.stage,
				parent : conf.parent
			});
		}
	});

	module.exports = DiagramPanel;

});

