/**
 * @fileoverview 柱形图
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */

define('mods/util/chart/echarts/bar',function(require,exports,module){

	var $ = require('lib');
	var $chartManager = require('mods/util/chartManager');
	var $echarts = require('vendor/echarts');
	var $tpl = require('lib/kit/util/template');
	var $mustache = require('lib/more/mustache');
	var $querystring = require('lib/more/querystring');

	var TPL = $tpl({
		options : [
			'<ul>',
				'<li>宽度：<input name="width" placeholder="{{defaults.width}}" value="{{width}}"/> px</li>',
				'<li>高度：<input name="height" placeholder="{{defaults.height}}" value="{{height}}"/> px</li>',
				'<li>数据名称：<input name="dataName" placeholder="{{defaults.dataName}}" value="{{dataName}}"/></li>',
				'<li>X轴：<input name="xAxis" value="{{xAxis}}"/></li>',
				'<li>Y轴：<input name="yAxis" value="{{yAxis}}"/></li>',
			'</ul>'
		]
	});

	var that = {
		name : 'echarts/bar',
		getDefaults : function(){
			var defaults = {
				dataMap : null,
				dataName : 'value',
				width : Math.floor(window.screen.width * 0.8),
				height : Math.floor(window.screen.height * 0.3)
			};
			return defaults;
		},
		cleanOptions : function(options){
			options = options || {};
			Object.keys(options).forEach(function(key){
				if(options[key] === ''){
					delete options[key];
				}
			});
			return options;
		},
		//获取选项html，并填充给出的选项
		getOptionsHtml : function(options){
			var tpl = TPL.get('options');
			var defaults = that.getDefaults();
			options.defaults = defaults;
			var html = $mustache.render(tpl, options);
			return html;
		},
		//从html中读取填写的选项
		readOptions : function(node){
			var options = {};
			var query = $(node).serialize();
			var para = $querystring.parse(query);
			para = that.cleanOptions(para);
			$.extend(options, para);
			return options;
		},
		//构建图表
		build : function(options){
			options = that.cleanOptions(options);
			var conf = $.extend(that.getDefaults(), options);
			var node = conf.node;
			var elChart = $(node);
			var dataMap = conf.dataMap;

			elChart.css({
				'width' : conf.width + 'px',
				'height' : conf.height + 'px'
			});

			var chart = $echarts.init(node);
			delete conf.node;

			if(
				!dataMap ||
				!Array.isArray(dataMap) ||
				!dataMap.length
			){return;}

			if(!$.isPlainObject(dataMap[0])){return;}

			var keys = Object.keys(dataMap[0]);
			if(keys.length < 2){return;}

			var xAxisName = conf.xAxis || keys[0];
			var yAxisName = conf.yAxis || keys[1];

			var xAxisData = dataMap.map(function(item){
				return item[xAxisName];
			});

			var yAxisData = dataMap.map(function(item){
				return item[yAxisName];
			});

			var option = {
				tooltip: {
					show: true
				},
				xAxis : [
					{
						type : 'category',
						data : xAxisData
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						'name':conf.dataName,
						"type":"bar",
						"data":yAxisData
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















