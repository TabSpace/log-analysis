/**
 * @fileoverview 设置
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/config',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var Config = $model.extend({
		defaults : {
			dataPath : 'data/'
		}
	});

	module.exports = new Config(window.$CONFIG);

});















