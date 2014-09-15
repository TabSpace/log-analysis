/**
 * @fileoverview 图表集合
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/util/charts',function(require,exports,module){

	var $ = require('lib');
	var $chartManager = require('mods/util/chartManager');

	require('mods/util/chart/echarts/bar');

	var charts = $chartManager;

	module.exports = charts;

});














