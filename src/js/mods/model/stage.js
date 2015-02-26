/**
 * @fileoverview 场景公共数据
 * @authors Tony Liang <pillar0514@163.com>
 */
define('mods/model/stage',function(require,exports,module){

	var $model = require('lib/mvc/model');

	var Stage = $model.extend({
		defaults : {
			currentTab : 'data'
		}
	});

	module.exports = new Stage();

});

