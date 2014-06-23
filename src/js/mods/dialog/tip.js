/**
 * @fileoverview 弹出提示
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */

define('mods/dialog/tip',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $TipBox = require('mods/view/dialog/tip');

	var TipModel = $model.extend({
		defaults : {
			visible : false,
			tip : ''
		},
		active : function(){
			var that = this;
			this.set('visible', true);
			if(this.timer){
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(function(){
				that.set('visible', false);
				that.timer = null;
			}, 2000);
		}
	});

	var tipModel = new TipModel();

	var dialog = new $TipBox({
		model : tipModel
	});

	var showTip = function(msg, options){
		tipModel.set('tip', msg);
		tipModel.active();
	};

	module.exports = showTip;

});

