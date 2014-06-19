/**
 * @fileoverview 控制面板
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/ctrl/controlPanel',function(require,exports,module){

	var $controller = require('lib/mvc/controller');

	var ControlPanel = $controller.extend({
		defaults : {
			data : null,
			stage : null,
			parent : null
		}
	});

	module.exports = ControlPanel;

});

