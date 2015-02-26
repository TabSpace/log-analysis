/**
 * @fileoverview 图表集合
 * @authors Tony Liang <pillar0514@163.com>
 */
define('mods/util/charts',function(require,exports,module){

	var $ = require('lib');
	var $chartManager = require('mods/util/chartManager');

	require('mods/util/chart/echarts/bar');
	require('mods/util/chart/echarts/line');
	require('mods/util/chart/echarts/scatter');
	require('mods/util/chart/echarts/pie');
	require('mods/util/chart/echarts/custom');

	var charts = $chartManager;

	module.exports = charts;

});















