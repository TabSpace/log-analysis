/**
 * @fileoverview 数据库模型，负责与indexedDB的交互
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/database',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

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
			this.prepareDB();
		},
		ready : function(){
			this.clearCache();
			this.load();
		},
		prepareDB : function(){
			var that = this;
			if('indexedDB' in window){
				if(!this.db){
					var request = indexedDB.open(DATABASE_NAME);
					request.onerror = function(e) {
						console.log("db error: " + e.target.errorCode);
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
		save : function(data){
			if(this.get('ready')){
				this.saveToDb(data);
			}else{
				this.cache.push(data);
			}
		},
		clearCache : function(){
			var data;
			while(this.cache.length){
				data = this.cache.shift();
				this.saveToDb(data);
			}
		},
		saveToDb : function(data){
			if(!this.db){return;}
			var that = this;
			var db = this.db;
			console.log('database:', db);
			var transaction = db.transaction(TABLE_NAME, "readwrite");
			var store = transaction.objectStore(TABLE_NAME);

			var keys = Object.keys(data);
			keys.forEach(function(path){
				var item = {};
				item.path = path;
				item.data = data[path];

				console.log('item for save:', item);

				store.get(path).onsuccess = function(event){
					var item = event.target.item;
					console.log('item saved:', item);
				};

				// try{
				// 	var req = store.add(item);
				// 	req.onsuccess = function(e){
				// 		console.log('');
				// 	};
				// 	req.onerror = function(e){
				// 		console.log('Database error:', e.value);
				// 	};
				// }catch(e){
				// 	console.log('save:', path, 'error!');
				// }

			});
		},
		load : function(){
			if(!this.db){return;}
			var db = this.db;
			var transaction = db.transaction(TABLE_NAME, 'readonly');
			var store = transaction.objectStore(TABLE_NAME);
		}
	});

	module.exports = new DataBase();

});















