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

	var Pipe = $model.extend({
		defaults : {
			name : '',
			data : null,
			source : null,
			error : false,
			filter : null
		},
		events : {
			//数据源变更时需要计算
			'change:source' : 'compute',
			//过滤器变更时需要计算
			'change:filter' : 'compute'
		},
		build : function(){
			this.compute();
		},
		setEvents : function(action){
			this.delegate(action);
		},
		setConf : function(options){
			this.set(options);
			console.log('pipeConf:', this.get());
		},
		//计算经过自己的过滤器过滤的数据
		compute : function(){
			var source = this.get('source');
			var filter = this.get('filter');
			var vnames;
			var vname;
			var data;

			this.set('error', false);
			console.log('compute source',source);
			if($.type(source) !== 'object'){
				this.set('data', null);
				this.set('error', 'source');
			}else{
				vnames = Object.keys(source);
				if(vnames.length){
					vname = vnames[0];
					data = $getData(source[vname]);
					if(data){
						if(!filter){
							this.set('data', data);
						}else{

						}
					}else{
						this.set('data', null);
						this.set('error', 'source');
					}
				}else{
					this.set('data', null);
					this.set('error', 'source');
				}
			}
		}
	});

	module.exports = Pipe;

});










