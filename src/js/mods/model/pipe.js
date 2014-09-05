/**
 * @fileoverview 管道对象，包含过滤规则和被过滤的数据，作为数据树的节点
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/pipe',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $tip = require('mods/dialog/tip');
	var $channel = require('mods/channel/global');
	var $getDataModel = require('mods/util/getDataModel');
	var $delay = require('lib/kit/func/delay');
	var $contains = require('lib/kit/arr/contains');

	var Pipe = $model.extend({
		defaults : {
			type : 'pipe',
			name : '',
			data : null,
			source : null,
			state : 'prepare',
			ready : false,
			filter : null
		},
		events : {
			//数据源变更时需要计算
			'change:source' : 'compute',
			//过滤器变更时需要计算
			'change:filter' : 'compute',
			'change:ready' : 'checkReady',
		},
		build : function(){
			this.compute = $delay(this.compute, 10);
			this.executeCompute = $delay(this.executeCompute, 50);
			this.checkPrepare();
			this.checkUpdate();
			this.checkReady();
		},
		setEvents : function(action){
			var proxy = this.proxy();
			this.delegate(action);
			$channel[action]('data-prepare', proxy('checkPrepare'));
			$channel[action]('data-ready', proxy('checkUpdate'));
		},
		setConf : function(options){
			this.set(options);
		},
		//检查数据是否准备完毕，准备完毕后要发送广播通知关联组件更新数据
		checkReady : function(){
			if(this.isReady()){
				$channel.trigger('data-ready', this.get('name'));
			}else{
				$channel.trigger('data-prepare', this.get('name'));
			}
		},
		isReady : function(){
			return !!this.get('ready');
		},
		//检查是否要将自己变更为数据准备中状态
		checkPrepare : function(name){
			if(name === this.get('name')){return;}
			var requiredPath = this.getRequiredPath();
			if(name){
				if($contains(requiredPath, name)){
					this.set('ready', false);
					this.set('state', 'prepare');
				}else{
					//do nothing
				}
			}else{
				this.set('ready', false);
				this.set('state', 'prepare');
			}
		},
		//检查是否要更新自己的数据
		checkUpdate : function(name){
			if(name === this.get('name')){return;}
			var requiredPath = this.getRequiredPath();
			if(name){
				if($contains(requiredPath, name)){
					this.checkCompute();
				}else{
					//do nothing
				}
			}else{
				this.checkCompute();
			}
		},
		//检查是否可以进行数据计算
		checkCompute : function(){
			var requiredPath = this.getRequiredPath();
			var allReady = requiredPath.every(function(name){
				var requiredModel = $getDataModel(name);
				return requiredModel.isReady();
			});
			if(allReady){
				this.compute();
			}
		},
		//根据用户设置的源数据表单项，获取源数据列表
		getRequiredPath : function(){
			var source = this.get('source');
			if(source){
				return Object.keys(source).map(function(key){
					return source[key];
				});
			}else{
				return [];
			}
		},
		//使用多线程计算
		runWithWorker : function(){
			var that = this;
			var source = this.get('source');
			var filter = this.get('filter');
			var code = [];
			code = code.concat([
				'onmessage = function(e){',
				'    postMessage(',
				'        (function(' + Object.keys(source).join(',') + '){',
							filter,
				'        })(' +
						Object.keys(source).map(function(name){
							return 'e.data["' + name + '"]';
						}).join(',') + ')',
				'    );',
				'    self.close();',
				'};'
			]);

			var blob = new Blob(code, {type: "text/javascript;charset=UTF-8"});
			var url = window.URL.createObjectURL(blob);
			var worker = new Worker(url);
			worker.onerror = function(e){
				worker.terminate();
				console.error(this.get('type') + ' ' + that.get('name') + ' compute error:', e.message);
				that.set('data', null);
				that.set('state', 'error');
				that.set('ready', true);
			};
			worker.onmessage = function(e){
				worker.terminate();
				that.set('data', e.data);
				that.set('state', 'success');
				that.set('ready', true);
			};

			var rs = {};
			$.each(source, function(name, path){
				var smodel = $getDataModel(path);
				if(smodel){
					rs[name] = smodel.get(true, 'data');
				}else{
					rs[name] = null;
				}
			});

			worker.postMessage(rs);
		},
		//不使用多线程计算
		runWithoutWorker : function(){
			var that = this;
			var source = this.get('source');
			var filter = this.get('filter');
			var code = '';
			var args = [];
			var data;
			Object.keys(source).forEach(function(name, index){
				code = 'var ' + name + ' = arguments[' + index + '];\n';
				var smodel = $getDataModel(source[name]);
				if(smodel){
					args.push(smodel.get('data'));
				}else{
					args.push(null);
				}
			});
			code = code + filter;

			setTimeout(function(){
				try{
					var fn = new Function(code);
					data = fn.apply(that, args);

					if(data){
						that.set('data', data);
						that.set('state', 'success');
					}else{
						that.set('data', null);
						that.set('state', 'error');
					}
				}catch(e){
					console.error(this.get('type') + ' ' + that.get('name') + ' compute error:', e.message);
					that.set('data', null);
					that.set('state', 'error');
				}finally{
					that.set('ready', true);
				}
			});
		},
		executeCompute : function(){
			var that = this;
			var source = this.get('source');
			var filter = this.get('filter');
			var requiredPath = this.getRequiredPath();
			var data;
			var sourceModel;

			if($.type(source) !== 'object'){
				this.set('data', null);
				this.set('state', 'error');
				this.set('ready', true);
			}else{
				if(requiredPath.length){
					if(!filter){
						sourceModel = $getDataModel(requiredPath[0]);
						if(sourceModel){
							data = sourceModel.get('data');
						}
						if(data){
							this.set('data', data);
							this.set('state', 'success');
						}else{
							this.set('data', null);
							this.set('state', 'error');
						}
						this.set('ready', true);
					}else{
						if(window.Worker){
							this.runWithWorker();
						}else{
							this.runWithoutWorker();
						}
					}
				}else{
					this.set('data', null);
					this.set('state', 'error');
					this.set('ready', true);
				}
			}
		},
		//计算经过自己的过滤器过滤的数据
		compute : function(){
			this.set('ready', false);
			this.set('state', 'prepare');
			this.checkReady();

			this.executeCompute();
		}
	});

	module.exports = Pipe;

});










