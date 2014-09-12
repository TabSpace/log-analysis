/**
 * @fileoverview 图表模型
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/diagram',function(require,exports,module){

	var $ = require('lib');
	var $tip = require('mods/dialog/tip');
	var $channel = require('mods/channel/global');
	var $pipe = require('mods/model/pipe');
	var $getDataModel = require('mods/util/getDataModel');

	var $contains = require('lib/kit/arr/contains');

	var Diagram = $pipe.extend({
		defaults : {
			type : 'diagram',
			name : '',
			data : null,
			source : null,
			state : 'prepare',
			ready : false,
			chart : null,
			filter : null
		},
		//检查数据是否准备完毕，准备完毕后要发送广播通知关联组件更新数据
		checkReady : function(){
			//图表为流程的最后一步，无需发送准备状态
		},
		//检查是否要更新自己的数据
		checkUpdate : function(name){
			//允许图表与过滤器重名。
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
		}
	});

	module.exports = Diagram;

});










