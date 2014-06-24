/**
 * @fileoverview 数据挂载的根节点
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/root',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $data = require('mods/model/data');

	var Root = $model.extend({
		defaults : {

		},
		createData : function(path){
			return new $data({
				path : path
			});
		},
		addData : function(path){
			var that = this;
			var data = this.get(path);
			if(data){
				if(confirm('该数据记录已加载，需要重新加载吗？')){
					data.set('data', null);
					data.request();
				}else{
					return;
				}
			}else{
				data = this.createData(path);
				data.on('change', function(){
					that.trigger('change');
				});
				data.on('destroy', function(){
					that.removeData(path);
				});
			}
			this.set(path, data);
		},
		removeData : function(path){
			var data = this.get(path);
			this.remove(path);
			data.destroy();
		}
	});

	module.exports = new Root();

});















