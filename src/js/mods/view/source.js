/**
 * @fileoverview 数据源
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/source',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $mustache = require('lib/more/mustache');

	var TPL = $tpl({
		box : [

		]
	});

	var Source = $view.extend({
		defaults : {
			parent : null,
			model : null,
			template : TPL.box
		},
		build : function(){

		},
		setEvents : function(action){
			this.delegate(action);
		}
	});

	module.exports = Source;

});