/**
 * @fileoverview 设置
 * @authors Tony Liang <pillar0514@163.com>
 */
define('mods/model/config',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $delay = require('lib/kit/func/delay');

	var CONFIG_COMMON_NAME = 'CONFIG_COMMON_DATA';

	var Config = $model.extend({
		defaults : {
			fileName : 'config'
		},
		events : {
			'change' : 'save'
		},
		build : function(){
			this.save = $delay(this.save, 50);
			this.load();
		},
		save : function(){
			var storeData = this.get();
			try{
				localStorage.setItem(CONFIG_COMMON_NAME, JSON.stringify(storeData));
			}catch(e){
				console.error('Save config error:', e.message);
			}
		},
		load : function(){
			var data = {};
			try{
				data = localStorage.getItem(CONFIG_COMMON_NAME);
				data = JSON.parse(data);
			}catch(e){
				console.error('Load config error:', e.message);
			}
			if(!data){
				data = {};
			}
			this.set(data);
		}
	});

	module.exports = new Config(window.$CONFIG);

});















