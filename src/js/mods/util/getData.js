/**
 * @fileoverview 根据源路径或者过滤器名称获取数据
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/util/getData',function(require,exports,module){

	var $ = require('lib');

	//获取数据源数据
	var getSourceData = function(path){
		var root = window.globalRoot;
		if(!root){return null;}
		var source = root.getSource(path);
		if(source && $.isFunction(source.get)){
			return source.get('data');
		}else{
			return null;
		}
	};

	//获取过滤器数据
	var getPipeData = function(name){
		var pipelist = window.globalPipeList;
		if(!pipelist){return null;}
		var pipe = pipelist.getPipe(name);
		if(pipe && $.isFunction(pipe.get)){
			return pipe.get('data');
		}else{
			return null;
		}
	};

	//获取一个数据列表
	module.exports = function(datapath){
		var data;
		if((/[\/\\]/).test(datapath)){
			data = getSourceData(datapath);
		}else{
			data = getPipeData(datapath);
		}
		return data;
	};

});















