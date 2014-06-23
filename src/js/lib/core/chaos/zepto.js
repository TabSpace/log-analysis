/**
 * @fileoverview zepto lib 混合文件 
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('lib/core/chaos/zepto',function(require,exports,module){

	//zepto modules
	var Zepto = require('lib/core/zepto/zepto');
	require('lib/core/zepto/event');
	require('lib/core/zepto/fx');

	//zepto plugin
	require('lib/core/extra/zepto/zepto');
	require('lib/core/extra/zepto/prefixfree');
	require('lib/core/extra/zepto/transform');
	require('lib/core/extra/zepto/transit');
	require('lib/core/extra/zepto/hammer');

	module.exports = Zepto;

});

