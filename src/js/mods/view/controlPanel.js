/**
 * @fileoverview 控制面板
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/controlPanel',function(require,exports,module){

	var $view = require('lib/mvc/view');

	var ControlPanel = $view.extend({
		defaults : {
			data : null,
			stage : null,
			parent : null
		}
	});

	module.exports = ControlPanel;

});

