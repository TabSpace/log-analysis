/**
 * @fileoverview 控制面板
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/ctrl/diagramPanel',function(require,exports,module){

	var $controller = require('lib/mvc/controller');

	var DiagramPanel = $controller.extend({
		defaults : {
			data : null,
			stage : null,
			parent : null
		}
	});

	module.exports = DiagramPanel;

});

