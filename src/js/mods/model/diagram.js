/**
 * @fileoverview 图表模型
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/diagram',function(require,exports,module){

	var $ = require('lib');
	var $tip = require('mods/dialog/tip');
	var $channel = require('mods/channel/global');
	var $pipe = require('mods/model/pipe');

	var Diagram = $pipe.extend({
		defaults : {
			type : 'diagram',
			name : '',
			data : null,
			source : null,
			state : 'prepare',
			ready : false,
			filter : null
		}
	});

	module.exports = Diagram;

});










