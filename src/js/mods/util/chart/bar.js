/**
 * @fileoverview 柱形图
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */

define('mods/util/chart/bar',function(require,exports,module){

	var $ = require('lib');
	var $chartManager = require('mods/util/chartManager');
	var $echarts = require('vendor/echarts');

	var that = {
		name : '柱形图',
		build : function(options){
			var conf = $.extend({}, options);
			var node = conf.node;
			var myChart = $echarts.init(node);
			delete conf.node;

			var option = {
				tooltip: {
					show: true
				},
				legend: {
					data:['销量']
				},
				xAxis : [
					{
						type : 'category',
						data : ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						"name":"销量",
						"type":"bar",
						"data":[5, 20, 40, 10, 10, 20]
					}
				]
			};

			// 为echarts对象加载数据 
			myChart.setOption(option);
		}
	};

	$chartManager.register('bar', that);

	module.exports = that;

});















