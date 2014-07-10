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
		//读取一个文本文件，或者一个JSON作为自己的数据
		readBlob : function(blob){
			var that = this;
			if(blob && blob.size){
				var reader = new FileReader();
				reader.readAsText(blob);
				reader.onload = function(){
					that.buildData(reader.result);
				};
			}else if($.type(blob) === 'array'){
				that.set('data', blob);
			}
		},
		buildData : function(text){
			var list = text.split(/[\r\n]/);
			this.set('data', list);
		}
	});

	module.exports = Data;

});

