/**
 * @fileoverview 数据管道 / 过滤器
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/pipe',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $mustache = require('lib/more/mustache');

	var TPL = $tpl({
		box : [

		]
	});

	var Pipe = $view.extend({
		defaults : {

		},
		build : function(){

		},
		setEvents : function(action){
			this.delegate(action);
		},
		setModel : function(){

		}
	});

	module.exports = Pipe;

});