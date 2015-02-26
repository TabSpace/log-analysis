/**
 * @fileoverview 自定义图表
 * @authors Tony Liang <pillar0514@163.com>
 */

define('mods/util/chart/echarts/custom',function(require,exports,module){

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
			'</ul>'
		]
	});

	var that = {
		name : 'echarts/custom',
		getDefaults : function(){
			var defaults = {
				dataMap : null,
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
				!$.isPlainObject(dataMap)
			){return;}

			// 为echarts对象加载数据 
			chart.setOption(dataMap);

			return chart;
		}
	};

	$chartManager.register('echarts/custom', that);

	module.exports = that;

});















