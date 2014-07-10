/**
 * @fileoverview 全局广播
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */

define('mods/channel/global',function(require,exports,module){

	var $listener = require('lib/common/listener');
	module.exports = new $listener([
		//从indexedDB加载了存储的数据
		'load-data',
		//移除数据源
		'remove-source'
	]);
});
