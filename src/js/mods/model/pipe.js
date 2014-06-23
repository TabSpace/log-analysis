/**
 * @fileoverview 数据中心 - 管道对象，包含过滤规则和被过滤的数据，作为数据树的节点
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/pipe',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var Pipe = $model.extend({
		defaults : {
			name : '',
			data : null,
			source : null,
			filter : null
		},
		build : function(){

		}
	});

	module.exports = Pipe;

});










