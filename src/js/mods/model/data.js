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
		build : function(){
			this.request();
		},
		request : function(){
			var that = this;
			var path = this.get('path');
			$.ajax({
				dataType : 'text',
				url : path,
				success : function(rs){
					that.buildData(rs);
					$tip(path + ':数据加载成功');
				},
				error : function(rs){
					$tip(path + ':数据加载失败');
					that.trigger('destroy');
					that.destroy();
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

