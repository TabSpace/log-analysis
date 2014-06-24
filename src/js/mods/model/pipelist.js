/**
 * @fileoverview 数据中心 - 管道对象集合
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/pipelist',function(require,exports,module){

	var $ = require('lib');
	var $collection = require('lib/mvc/collection');
	var $pipe = require('mods/model/pipe');
	var $find = require('lib/kit/util/find');

	var PipeList = $collection.extend({
		defaults : {

		},
		build : function(){

		},
		getPipeIndex : function(name){
			var index = $find(this, function(item){
				var result = false;
				if(item && item.conf && item.conf.name){
					result  = item.conf.name === name;
				}
				return result;
			}, this)[0];
			return index;
		},
		getPipeByIndex : function(index){
			if($.type(index) === 'number'){
				return this.get(index);
			}
		},
		getPipeByName : function(name){
			var index = this.getPipeIndex(name);
			var pipe = this.getPipeByIndex(index);
			return pipe;
		},
		addPipe : function(spec){
			var pipe = new $pipe(spec);
			pipe.on('change', function(){
				this.trigger('change');
			}.bind(this));
			this.push(pipe);
			return pipe;
		},
		removePipe : function(name){
			var index = this.getPipeIndex(name);
			var pipe = this.getPipeByIndex(index);
			pipe.off();
			this.remove(index);
		}
	});

	module.exports = new PipeList();

});










