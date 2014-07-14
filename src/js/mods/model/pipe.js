/**
 * @fileoverview 数据中心 - 管道对象，包含过滤规则和被过滤的数据，作为数据树的节点
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/pipe',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $root = require('mods/model/root');
	var $tip = require('mods/dialog/tip');

	var Pipe = $model.extend({
		defaults : {
			name : '',
			data : null,
			source : null,
			error : false,
			filter : null
		},
		events : {
			'change:source' : 'compute',
			'change:filter' : 'compute'
		},
		build : function(){
			this.compute();
		},
		setEvents : function(action){
			this.delegate(action);
		},
		getSourceData : function(path){
			var source = $root.getSource(path);
			if(source && $.isFunction(source.get)){
				return source.get('data');
			}else{
				console.info('数据源：', path, '不存在');
				this.set('error', 'source');
				return null;
			}
		},
		getPipeData : function(name){
			var pipelist = this.pipelist;
			if(!pipelist){
				return null;
			}
			var pipe = pipelist.getPipe(name);
			if(pipe && $.isFunction(pipe.get)){
				return pipe.get('data');
			}else{
				console.info('过滤器：', name, '不存在');
				this.set('error', 'source');
				return null;
			}
		},
		getData : function(datapath){
			var data;
			if((/[\/\\]/).test(datapath)){
				data = this.getSourceData(datapath);
			}else{
				data = this.getPipeData(datapath);
			}
			return data;
		},
		compute : function(){
			var source = this.get('source');
			var filter = this.get('filter');
			var vname;
			var datapath;
			var dataMap;
			this.set('error', false);
			if($.type(source) !== 'object'){
				this.set('data', null);
			}else{
				if(!filter){
					vname = Object.keys(source)[0];
					this.set('data', this.getData(source[vname]));
				}else{

				}
			}
		}
	});

	module.exports = Pipe;

});










