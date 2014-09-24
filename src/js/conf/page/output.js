/**
 * @fileoverview 数据输出页
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('conf/page/output',function(require,exports,module){
	require('conf/global');

	var $DiagramOutput = require('mods/view/diagramOutput');
	var $config = window.$CONFIG || {};

	var title = $config.common ?
		( $config.common.fileName || '图表' ) :
		'图表';

	var wrapper = $('#wrapper');
	var diagramBox = new $DiagramOutput({
		title : title,
		parent : wrapper
	});

	var diagramlist = $config.diagramlist;
	if(diagramlist){
		Object.keys(diagramlist).forEach(function(name){
			var conf = diagramlist[name];
			diagramBox.addDiagram(conf);
		});
	}

});

