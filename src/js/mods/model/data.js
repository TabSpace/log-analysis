/**
 * @fileoverview 源数据
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/data',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $tip = require('mods/dialog/tip');

	var Data = $model.extend({
		defaults : {
			path : '',
			data : null
		},
		readBlob : function(blob){
			var that = this;
			var reader = new FileReader();
			reader.readAsText(blob);
			reader.onload = function(){
				that.buildData(reader.result);
			};
		},
		buildData : function(text){
			var list = text.split(/[\r\n]/);
			this.set('data', list);
		}
	});

	module.exports = Data;

});

