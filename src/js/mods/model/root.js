/**
 * @fileoverview 数据挂载的根节点
 * @authors Tony Liang <pillar0514@163.com>
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
		setEvents : function(action){
			var proxy = this.proxy();
			this.delegate(action);
			$database.on('loadData', proxy('load'));
		},
		getSource : function(path){
			return this.get(path);
		},
		//添加一个源数据
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
		//移除一个源数据
		removeSource : function(path){
			var data = this.get(path);
			data.destroy();
			this.remove(path);
		},
		//保存数据
		save : function(){
			var that = this;
			var data = {};
			var keys = this.keys();
			keys.forEach(function(path){
				var source = that.get(path);
				data[path] = source.get('data');
			});
			$database.save(data);
		}
	});

	module.exports = window.globalRoot = new Root();

});















