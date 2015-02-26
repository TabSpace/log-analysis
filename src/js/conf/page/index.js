/**
 * @fileoverview 数据统计首页
 * @authors Tony Liang <pillar0514@163.com>
 */
define('conf/page/index',function(require,exports,module){
	require('conf/global');

	var $menu = require('mods/view/menu');
	var $ControlPanel = require('mods/ctrl/controlPanel');
	var $DiagramPanel = require('mods/ctrl/diagramPanel');
	var $DataPanel = require('mods/ctrl/dataPanel');

	var wrapper = $('#wrapper');

	//菜单
	var menu = new $menu({
		parent : wrapper
	});

	//控制面板
	var controlPanel = new $ControlPanel({
		parent : wrapper
	});

	//图表面板
	var diagramPanel = new $DiagramPanel({
		parent : wrapper
	});

	//数据面板
	var dataPanel = new $DataPanel({
		parent : wrapper
	});

});

