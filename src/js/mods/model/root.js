/**
 * @fileoverview 数据挂载的根节点
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/root',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $data = require('mods/model/data');
	var $database = require('mods/model/database');

	var Root = $model.extend({
		defaults : {},
		events : {
			'change' : 'save'
		},
		build : function(){

		},
		addSource : function(path, blob){
			var that = this;
			var data = new $data({
				path : path
			});
			data.on('change', function(){
				that.trigger('change');
			});
			data.on('destroy', function(){
				that.removeSource(path);
			});
			this.set(path, data);
			data.readBlob(blob);
		},
		removeSource : function(path){
			var data = this.get(path);
			data.destroy();
			this.remove(path);
		},
		save : function(){
			var that = this;
			var data = {};
			var keys = this.keys();
			keys.forEach(function(path){
				var source = that.get(path);
				data[path] = source.get('data');
			});
			$database.save(data);
		},
		load : function(){
			try{

			}catch(e){}
		}
	});

	module.exports = new Root();

});















