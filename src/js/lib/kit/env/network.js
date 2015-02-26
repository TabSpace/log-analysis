/**
 * @fileoverview 网络环境检测
 * @authors Tony Liang <pillar0514@163.com>
 */

define('lib/kit/env/network',function(require,exports,module){

	var supportOnlineCheck = 'onLine' in navigator;

	module.exports = {
		//是否联网
		onLine : function(){
			return supportOnlineCheck ? navigator.onLine : true;
		}
	};

});


