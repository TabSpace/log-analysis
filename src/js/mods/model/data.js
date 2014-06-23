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
			name : '',
			path : '',
			data : null
		},
		request : function(){
			var that = this;
			var path = this.get('path');
			$.ajax({
				dataType : 'text',
				url : path,
				success : function(rs){
					that.buildData(rs);
					$tip('数据加载成功');
				},
				failure : function(rs){
					$tip('数据加载失败');
				}
			});
		},
		buildData : function(text){
			var list = text.split(/[\r\n]/);
			this.set('data', list);
		}
	});

	module.exports = Data;

});

