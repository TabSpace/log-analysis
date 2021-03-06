/**
 * @fileoverview 数据列表
 * @authors Tony Liang <pillar0514@163.com>
 */
define('mods/ctrl/dataPanel',function(require,exports,module){

	var $controller = require('lib/mvc/controller');
	var $dataView = require('mods/view/dataPanel');
	var $root = require('mods/model/root');
	var $config = require('mods/model/config');
	var $sourceView = require('mods/view/source');
	var $channel = require('mods/channel/global');
	var $pipelist = require('mods/model/pipelist');
	var $tip = require('mods/dialog/tip');
	var $pipeView = require('mods/view/pipe');

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
			objs.view[action]('addPipe', proxy('addPipe'));
			$channel[action]('remove-source', proxy('removeDataSource'));
			$channel[action]('remove-pipe', proxy('removePipe'));
			$channel[action]('load-data', proxy('loadDataSource'));
			$channel[action]('load-pipes', proxy('loadPipes'));
		},
		//添加一个过滤器
		addPipe : function(name, pipeConf){
			var objs = this.objs;
			var pipe = $pipelist.get(name);
			var pipeBox = objs.view.role('pipe-list');

			if(pipe){
				$tip('已存在同名过滤器');
			}else{
				pipe = $pipelist.addPipe(name, pipeConf);
			}

			var pipeView = objs['pipe-' + name];
			if(!pipeView){
				pipeView = objs['pipe-' + name] = new $pipeView({
					parent : pipeBox,
					model : pipe
				});
			}
		},
		//移除一个过滤器
		removePipe : function(name){
			if(this.objs['pipe-' + name]){
				this.objs['pipe-' + name].destroy();
			}
			delete this.objs['pipe-' + name];
			$pipelist.removePipe(name);
		},
		//添加数据源
		addDataSource : function(path, blob){
			var objs = this.objs;
			var data = $root.get(path);
			var sourceBox = objs.view.role('source-list');
			var sourceView;

			if(data){
				if(blob && confirm('该数据记录已加载，需要重新加载吗？')){
					data.set('data', null);
					data.readBlob(blob);
				}else{
					return;
				}
			}else{
				$root.addSource(path, blob);
				data = $root.get(path);
				sourceView = objs['source-' + path];
				if(!sourceView){
					sourceView = new $sourceView({
						parent : sourceBox,
						model : data
					});
					objs['source-' + path] = sourceView;
				}
			}
		},
		//移除数据源
		removeDataSource : function(path){
			if(this.objs['source-' + path]){
				this.objs['source-' + path].destroy();
			}
			delete this.objs['source-' + path];
			$root.removeSource(path);
		},
		//加载从数据库读取的源数据
		loadDataSource : function(data){
			var that = this;
			$.each(data, function(path, source){
				if(path && source){
					that.addDataSource(path, source);
				}
			});
		},
		//加载从本地缓存存储的过滤器
		loadPipes : function(data){
			var that = this;
			$.each(data, function(name, pipeConf){
				if(name && pipeConf){
					that.addPipe(name, pipeConf);
				}
			});
		}
	});

	module.exports = DataPanel;

});

