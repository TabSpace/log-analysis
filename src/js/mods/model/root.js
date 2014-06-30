/**
 * @fileoverview 数据挂载的根节点
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/root',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $data = require('mods/model/data');

	var Root = $model.extend({
		defaults : {},
		addData : function(path, blob){
			var that = this;
			var data = new $data({
				path : path
			});
			data.on('change', function(){
				that.trigger('change');
			});
			data.on('destroy', function(){
				that.removeData(path);
			});
			this.set(path, data);
			data.readBlob(blob);
		},
		removeData : function(path){
			var data = this.get(path);
			data.destroy();
			this.remove(path);
		}
	});

	module.exports = new Root();

});















