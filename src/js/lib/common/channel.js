/**
 * @fileoverview 公共广播频道
 * @authors Tony Liang <pillar0514@163.com>
 */
define('lib/common/channel',function(require,exports,module){

	var $listener = require('lib/common/listener');
	module.exports = new $listener([
		//需要登录时触发
		'need-login'
	]);
});
