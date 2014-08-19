/**
 * @fileoverview 数据中心 - 管道对象，包含过滤规则和被过滤的数据，作为数据树的节点
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/pipe',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $tip = require('mods/dialog/tip');
	var $channel = require('mods/channel/global');
	var $getData = require('mods/util/getData');
	var $delay = require('lib/kit/func/delay');

	var Pipe = $model.extend({
		defaults : {
			name : '',
			data : null,
			source : null,
			state : 'prepare',
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
			this.compute();
		},
		setEvents : function(action){
			this.delegate(action);
		},
		setConf : function(options){
			this.set(options);
		},
		//计算经过自己的过滤器过滤的数据
		compute : function(){
			var that = this;
			var source = this.get('source');
			var filter = this.get('filter');
			var vnames;
			var vname;
			var data;

			this.set('state', 'prepare');
			if($.type(source) !== 'object'){
				this.set('data', null);
				this.set('state', 'error');
			}else{
				vnames = Object.keys(source);
				if(vnames.length){
					vname = vnames[0];
					data = $getData(source[vname]);
					if(data){
						if(!filter){
							this.set('data', data);
							this.set('state', 'success');
						}else{
							var code = '';
							var args = [];
							vnames.forEach(function(name, index){
								code = 'var ' + name + ' = arguments[' + index + '];\n';
								args.push($getData(source[name]));
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
								}
							});
						}
					}else{
						this.set('data', null);
						this.set('state', 'error');
					}
				}else{
					this.set('data', null);
					this.set('state', 'error');
				}
			}
		}
	});

	module.exports = Pipe;

});










