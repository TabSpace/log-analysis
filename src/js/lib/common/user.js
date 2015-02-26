/**
 * @fileoverview 用户状态管理
 * @authors Tony Liang <pillar0514@163.com>
 */
define('lib/common/user',function(require,exports,module){

	var $ = require('lib');
	var $channel = require('lib/common/channel');

	var User = {};

	//用户登录
	User.login = function(){
		//下面是微博的登录地址，考虑到可能存在第三方cookie问题，暂不使用它。
		//window.location = 'https://m.weibo.cn/login?ns=1&backURL='+ window.encodeURIComponent(location.href);
	};

	$channel.on('need-login', User.login);

	module.exports = User;

});


