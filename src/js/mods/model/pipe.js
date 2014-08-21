/**
 * @fileoverview 数据中心 - 管道对象，包含过滤规则和被过滤的数据，作为数据树的节点
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/pipe',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $tip = require('mods/dialog/tip');
	var $channel = require('mods/channel/global');
	var $getDataModel = require('mods/util/getDataModel');
	var $delay = require('lib/kit/func/delay');

	var Pipe = $model.extend({
		defaults : {
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
			'change:filter' : 'compute'
		},
		build : function(){
			this.compute = $delay(this.compute, 10);
			this.checkReady();
		},
		setEvents : function(action){
			this.delegate(action);
		},
		setConf : function(options){
			this.set(options);
		},
		checkReady : function(){
			if(this.isReady()){
				console.log('pipe ready');
				this.trigger('data-ready', this.get('name'));
			}else{
				console.log('pipe prepare');
				this.trigger('data-prepare', this.get('name'));
			}
		},
		isReady : function(){
			return !!this.get('ready');
		},
		//计算经过自己的过滤器过滤的数据
		compute : function(){
			console.log('compute');
			var that = this;
			var source = this.get('source');
			var filter = this.get('filter');
			var vnames;
			var vname;
			var data;
			var sourceModel;

			this.set('ready', false);
			this.set('state', 'prepare');

			if($.type(source) !== 'object'){
				this.set('data', null);
				this.set('state', 'error');
				this.set('ready', true);
			}else{
				vnames = Object.keys(source);
				if(vnames.length){
					if(!filter){
						sourceModel = $getDataModel(source[vnames[0]]);
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
						var code = '';
						var args = [];
						vnames.forEach(function(name, index){
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
								console.error('Pipe ' + that.get('name') + ' compute error:', e.message);
								that.set('data', null);
								that.set('state', 'error');
							}finally{
								that.set('ready', true);
							}
						});
					}
				}else{
					this.set('data', null);
					this.set('state', 'error');
					this.set('ready', true);
				}
			}
		}
	});

	module.exports = Pipe;

});










