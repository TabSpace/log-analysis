/**
 * @fileoverview 图表注册管理工具
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/util/chartManager',function(require,exports,module){

	var $ = require('lib');

	var charts = {};
	var manager = {};

	//注册一个图表组件
	manager.register = function(type, chart){
		charts[type] = chart;
	};

	//构建一个图表组件
	manager.build = function(type, options){
		var chart = charts[type];
		if(chart && chart.build){
			chart.build(options);
		}
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















