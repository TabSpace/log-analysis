/**
 * @fileoverview 源数据
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/data',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $tip = require('mods/dialog/tip');
	var $channel = require('mods/channel/global');

	var Data = $model.extend({
		defaults : {
			path : '',
			ready : false,
			data : null
		},
		events : {
			'change:ready' : 'checkReady'
		},
		build : function(){
			this.checkReady();
		},
		//读取一个文本文件，或者一个JSON作为自己的数据
		readBlob : function(blob){
			var that = this;
			this.set('ready', false);
			if(blob && blob.size){
				var reader = new FileReader();
				reader.readAsText(blob);
				reader.onload = function(){
					that.buildData(reader.result);
					that.set('ready', true);
				};
			}else if($.type(blob) === 'array'){
				that.set('data', blob);
				this.set('ready', true);
			}
		},
		buildData : function(text){
			var list = text.split(/[\r\n]/);
			this.set('data', list);
		},
		checkReady : function(){
			if(this.isReady()){
				$channel.trigger('data-ready', this.get('path'));
			}else{
				$channel.trigger('data-prepare', this.get('path'));
			}
		},
		isReady : function(){
			return !!this.get('ready');
		},
		refresh : function(){
			var that = this;
			this.set('ready', false);
			setTimeout(function(){
				that.set('ready', true);
			}, 50);
		}
	});

	module.exports = Data;

});

