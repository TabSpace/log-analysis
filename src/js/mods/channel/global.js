/**
 * @fileoverview 全局广播
 * @authors Tony Liang <pillar0514@163.com>
 */

define('mods/channel/global',function(require,exports,module){

	var $listener = require('lib/common/listener');
	module.exports = new $listener([
		//切换显示面板
		'switch-tab-to',
		//数据开始准备
		'data-prepare',
		//数据生成完毕
		'data-ready',
		//从localstorage加载存储的过滤器
		'load-pipes',
		//移除过滤器
		'remove-pipe',
		//从indexedDB加载了存储的数据
		'load-data',
		//移除数据源
		'remove-source',
		//从localstorage加载存储的图表
		'load-diagrams',
		//删除图表
		'remove-diagram'
	]);
});
