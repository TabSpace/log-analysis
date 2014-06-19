/**
 * @fileoverview 数据统计首页
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('conf/page/index',function(require,exports,module){
	require('conf/global');

	var $stage = require('mods/model/stage');
	var $data = require('mods/model/data');
	var $menu = require('mods/view/menu');
	var $ControlPanel = require('mods/ctrl/controlPanel');
	var $DiagramPanel = require('mods/ctrl/diagramPanel');
	var $DataPanel = require('mods/ctrl/dataPanel');

	var wrapper = $('#wrapper');
	var stage = new $stage();
	var data = new $data();

	//菜单
	var menu = new $menu({
		parent : wrapper,
		stage : stage
	});

	//控制面板
	var controlPanel = new $ControlPanel({
		data : data,
		stage : stage,
		parent : wrapper
	});

	//图表面板
	var diagramPanel = new $DiagramPanel({
		data : data,
		stage : stage,
		parent : wrapper
	});

	//数据面板
	var dataPanel = new $DataPanel({
		data : data,
		stage : stage,
		parent : wrapper
	});

});

