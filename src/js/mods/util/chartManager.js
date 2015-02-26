/**
 * @fileoverview 图表注册管理工具
 * @authors Tony Liang <pillar0514@163.com>
 */
define('mods/util/chartManager',function(require,exports,module){

	var $ = require('lib');

	var charts = {};
	var manager = {};

	//注册一个图表组件
	manager.register = function(type, chart){
		charts[type] = chart;
	};

	//获取依据图表选项渲染的选项列表DOM
	manager.getOptionsHtml = function(type, options){
		var chart = charts[type];
		var html = '';
		options = options || {};
		if(chart && chart.getOptionsHtml){
			html = chart.getOptionsHtml(options);
		}
		return html;
	};

	//从DOM中读取图表选项
	manager.readOptions = function(type, node){
		var chart = charts[type];
		var options = {};
		if(chart && chart.readOptions){
			options = chart.readOptions(node);
		}
		options.type = type;
		return options;
	};

	//构建一个图表组件
	manager.build = function(type, options){
		var chart = charts[type];
		if(chart && chart.build){
			chart.build(options);
		}
		return chart;
	};

	//获取已注册的图表的类型
	manager.getTypes = function(){
		var types = [];
		$.each(charts, function(type, chart){
			types.push({
				type : type,
				name : chart.name
			});
		});
		return types;
	};

	module.exports = manager;

});















