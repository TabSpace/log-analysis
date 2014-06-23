/**
 * @fileoverview 控制面板
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/ctrl/controlPanel',function(require,exports,module){

	var $controller = require('lib/mvc/controller');
	var $controlView = require('mods/view/controlPanel');

	var ControlPanel = $controller.extend({
		defaults : {
			data : null,
			stage : null,
			parent : null
		},
		build : function(){
			var conf = this.conf;
			var objs = this.objs;
			objs.view = new $controlView({
				data : conf.data,
				stage : conf.stage,
				parent : conf.parent
			});
		}
	});

	module.exports = ControlPanel;

});

