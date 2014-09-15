/**
 * @fileoverview 柱形图
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */

define('mods/util/chart/echarts/bar',function(require,exports,module){

	var $ = require('lib');
	var $chartManager = require('mods/util/chartManager');
	var $echarts = require('vendor/echarts');
	var $tpl = require('lib/kit/util/template');

	var TPL = $tpl({
		options : [
			'条形图的选项'
		]
	});

	var that = {
		name : 'echarts/bar',
		//获取选项html，并填充给出的选项
		getOptionsHtml : function(options){
			var tpl = TPL.get('options');
			console.log('getOptionsHtml', tpl);
			var html = tpl;
			return html;
		},
		//从html中读取填写的选项
		readOptions : function(node){
			var options = {};


			return options;
		},
		//构建图表
		build : function(options){
			var conf = $.extend({
				width : Math.floor(window.screen.width * 0.8),
				height : Math.floor(window.screen.height * 0.3),
				dataMap : null
			}, options);
			var node = conf.node;
			var elChart = $(node);

			elChart.css({
				'width' : conf.width + 'px',
				'height' : conf.height + 'px'
			});

			var chart = $echarts.init(node);
			delete conf.node;

			if(
				!conf.dataMap ||
				!Array.isArray(conf.dataMap) ||
				!conf.dataMap.length
			){return;}

			var category = [];
			var seriesData = [];

			category = Object.keys(conf.dataMap[0]);
			seriesData = category.map(function(name){
				return conf.dataMap[0][name];
			});

			var option = {
				tooltip: {
					show: true
				},
				xAxis : [
					{
						type : 'category',
						data : category
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						"name":"time",
						"type":"bar",
						"data":seriesData
					}
				]
			};

			// 为echarts对象加载数据 
			chart.setOption(option);

			return chart;
		}
	};

	$chartManager.register('echarts/bar', that);

	module.exports = that;

});















