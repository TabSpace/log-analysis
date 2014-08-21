/**
 * @fileoverview 根据源路径或者过滤器名称获取数据模型对象
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/util/getDataModel',function(require,exports,module){

	var $ = require('lib');

	//获取数据源
	var getSourceModel = function(path){
		var root = window.globalRoot;
		if(!root){return null;}
		var source = root.getSource(path);
		if(source && $.isFunction(source.get)){
			return source;
		}else{
			return null;
		}
	};

	//获取过滤器
	var getPipeModel = function(name){
		var pipelist = window.globalPipeList;
		if(!pipelist){return null;}
		var pipe = pipelist.getPipe(name);
		if(pipe && $.isFunction(pipe.get)){
			return pipe;
		}else{
			return null;
		}
	};

	//获取一个数据模型
	module.exports = function(datapath){
		var model;
		if((/[\/\\]/).test(datapath)){
			model = getSourceModel(datapath);
		}else{
			model = getPipeModel(datapath);
		}
		return model;
	};

});















