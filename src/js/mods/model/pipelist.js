/**
 * @fileoverview 数据中心 - 管道对象集合
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/pipelist',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $pipe = require('mods/model/pipe');

	var PipeList = $model.extend({
		defaults : {

		},
		build : function(){

		},
		getPipe : function(name){
			return this.get(name);
		},
		addPipe : function(name){
			var pipe = new $pipe({
				name : name
			});
			pipe.pipelist = this;
			this.set(name, pipe);
			return pipe;
		},
		removePipe : function(name){
			this.remove(name);
		}
	});

	module.exports = new PipeList();

});










