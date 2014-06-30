/**
 * @fileoverview 数据列表
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/ctrl/dataPanel',function(require,exports,module){

	var $controller = require('lib/mvc/controller');
	var $dataView = require('mods/view/dataPanel');
	var $root = require('mods/model/root');
	var $config = require('mods/model/config');
	var $sourceView = require('mods/view/source');
	var $channel = require('mods/channel/global');

	var DataPanel = $controller.extend({
		defaults : {
			parent : null
		},
		build : function(){
			var conf = this.conf;
			var objs = this.objs;
			objs.view = new $dataView({
				parent : conf.parent
			});
		},
		setEvents : function(action){
			var objs = this.objs;
			var proxy = this.proxy();
			this.delegate(action);
			objs.view[action]('addDataSource', proxy('addDataSource'));
			$channel[action]('remove-source', proxy('removeDataSource'));
		},
		addDataSource : function(path, blob){
			var objs = this.objs;
			var data = $root.get(path);
			var sourceBox = objs.view.role('source-list');
			var sourcePath = 'source:' + path;
			var sourceView;

			if(data){
				if(confirm('该数据记录已加载，需要重新加载吗？')){
					data.set('data', null);
					data.readBlob(blob);
				}else{
					return;
				}
			}else{
				$root.addData(path, blob);
				data = $root.get(path);
				sourceView = objs[sourcePath];
				if(!sourceView){
					sourceView = new $sourceView({
						parent : sourceBox,
						model : data
					});
					objs[sourcePath] = sourceView;
				}
			}
		},
		removeDataSource : function(path){
			var sourcePath = 'source:' + path;
			delete this.objs[sourcePath];
			$root.removeData(path);
		}
	});

	module.exports = DataPanel;

});

