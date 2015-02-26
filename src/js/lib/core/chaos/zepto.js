/**
 * @fileoverview zepto lib 混合文件 
 * @authors Tony Liang <pillar0514@163.com>
 */
define('lib/core/chaos/zepto',function(require,exports,module){

	//zepto modules
	var Zepto = require('lib/core/zepto/zepto');
	require('lib/core/zepto/event');
	require('lib/core/zepto/fx');
	require('lib/core/zepto/ajax');
	require('lib/core/zepto/form');

	//zepto plugin
	require('lib/core/extra/zepto/zepto');
	require('lib/core/extra/zepto/prefixfree');
	require('lib/core/extra/zepto/transform');
	require('lib/core/extra/zepto/transit');
	require('lib/core/extra/zepto/hammer');

	module.exports = Zepto;

});


