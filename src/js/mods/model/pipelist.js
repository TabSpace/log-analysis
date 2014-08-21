/**
 * @fileoverview 数据中心 - 管道对象集合
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/pipelist',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $pipe = require('mods/model/pipe');
	var $channel = require('mods/channel/global');
	var $delay = require('lib/kit/func/delay');

	var PIPE_LIST_NAME = 'PIPE_LIST_DATA';

	var PipeList = $model.extend({
		defaults : {

		},
		events : {
			'change' : 'save'
		},
		build : function(){
			this.save = $delay(this.save, 50);
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
			$channel[action]('load-data', proxy('load'));
		},
		getPipe : function(name){
			return this.get(name);
		},
		addPipe : function(name, pipeConf){
			var that = this;

			pipeConf = pipeConf || {};
			pipeConf.name = name;
			delete pipeConf.state;
			delete pipeConf.ready;
			var pipe = new $pipe(pipeConf);

			pipe.on('change', function(){
				that.trigger('change');
			});
			pipe.on('destroy', function(){
				that.removePipe(name);
			});
			this.set(name, pipe);
			return pipe;
		},
		removePipe : function(name){
			this.remove(name);
		},
		save : function(){
			var storeData = {};
			var data = this.get();
			$.each(data, function(name, pipe){
				var pipeConf = pipe.get();
				delete pipeConf.data;
				storeData[name] = pipeConf;
			});

			try{
				localStorage.setItem(PIPE_LIST_NAME, JSON.stringify(storeData));
			}catch(e){
				console.error('Save pipelist error:', e.message);
			}
		},
		load : function(){
			var data = {};
			try{
				data = localStorage.getItem(PIPE_LIST_NAME);
				data = JSON.parse(data);
			}catch(e){
				console.error('Load pipelist error:', e.message);
			}
			if(!data){
				data = {};
			}
			setTimeout(function(){
				$channel.trigger('load-pipes', data);
			});
		}
	});

	module.exports = window.globalPipeList = new PipeList();

});










