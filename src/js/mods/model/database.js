/**
 * @fileoverview 数据库模型，负责与indexedDB的交互
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/database',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $once = require('lib/kit/func/once');
	var $channel = require('mods/channel/global');

	var DATABASE_NAME = 'LOG_ANALYSIS';
	var TABLE_NAME = 'SOURCE_DATA';

	var DataBase = $model.extend({
		defaults : {
			ready : false
		},
		events : {
			'change:ready' : 'ready'
		},
		build : function(){
			this.cache = [];
			$(this.proxy('prepareDB'));
		},
		ready : function(){
			this.clearCache();
			this.load();
		},
		//准备数据库，以备后续工作
		prepareDB : function(){
			var that = this;
			if('indexedDB' in window){
				if(!this.db){
					var request = indexedDB.open(DATABASE_NAME);
					request.onerror = function(e) {
						console.log("db open error:", e.value);
					};
					request.onupgradeneeded = function(){
						var db = request.result;
						if(!db.objectStoreNames.contains(TABLE_NAME)){
							db.createObjectStore(TABLE_NAME, {keyPath: 'path'});
						}
					};
					request.onsuccess = function() {
						that.db = request.result;
						that.set('ready', true);
					};
				}
			}
		},
		//保存最新数据
		save : function(data){
			if(this.get('ready')){
				this.saveToDb(data);
			}else{
				this.cache.push(data);
			}
		},
		//清除缓存数据，缓存的数据来自未能及时存入数据库的新加载数据
		clearCache : function(){
			var data;
			while(this.cache.length){
				data = this.cache.shift();
				this.saveToDb(data);
			}
		},
		//将数据保存到数据库
		saveToDb : function(data){
			if(!this.db){return;}
			var that = this;
			var db = this.db;

			var transaction = db.transaction(TABLE_NAME, "readwrite");
			var store = transaction.objectStore(TABLE_NAME);

			store.clear().onsuccess = function(){
				var keys = Object.keys(data);
				keys.forEach(function(path){
					var item = {};
					item.path = path;
					item.data = data[path];
					store.get(path).onsuccess = function(event){
						var result = event.target.result;
						if(!result){
							store.add(item);
						}else{
							store.put(item);
						}
					};
				});
			};
		},
		//从数据库读取数据
		load : function(){
			var that = this;
			if(!this.db){return;}
			var db = this.db;
			var transaction = db.transaction(TABLE_NAME, 'readonly');
			var store = transaction.objectStore(TABLE_NAME);
			var req = store.openCursor();
			var data = {};
			req.onsuccess = $once(function(evt) {
				var cursor = evt.target.result;
				var item;
				if (cursor) {
					item = cursor.value;
					if(item.data){
						data[item.path] = item.data;
					}
					cursor.continue();
				}
				if(Object.keys(data).length > 0){
					$channel.trigger('load-data', data);
				}
			});
		}
	});

	module.exports = new DataBase();

});















