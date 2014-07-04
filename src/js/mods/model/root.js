/**
 * @fileoverview 数据挂载的根节点
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/root',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $data = require('mods/model/data');

	var STORAGE_KEY = 'LOG_ANALYSIS_SOURCE_DATA';

	var Root = $model.extend({
		defaults : {},
		events : {
			'change' : 'save'
		},
		build : function(){
			this.load();
		},
		addSource : function(path, blob){
			var that = this;
			var data = new $data({
				path : path
			});
			data.on('change', function(){
				that.trigger('change');
			});
			data.on('destroy', function(){
				that.removeSource(path);
			});
			this.set(path, data);
			data.readBlob(blob);
		},
		removeSource : function(path){
			var data = this.get(path);
			data.destroy();
			this.remove(path);
		},
		getIndexDBReq : function(){
			if('indexedDB' in window){
				console.log('support indexedDB');
				var request = indexedDB.open("library");
				request.onupgradeneeded = function(){
					var db = request.result;
					var store = db.createObjectStore("books", {keyPath: "isbn"});
					var titleIndex = store.createIndex("by_title", "title", {unique: true});
					var authorIndex = store.createIndex("by_author", "author");

					// Populate with initial data.
					store.put({title: "Quarry Memories", author: "Fred", isbn: 123456});
					store.put({title: "Water Buffaloes", author: "Fred", isbn: 234567});
					store.put({title: "Bedrock Nights", author: "Barney", isbn: 345678});
				};

				request.onsuccess = function() {
					db = request.result;
				};

				tx.oncomplete = function() {
				// All requests have succeeded and the transaction has committed.
				};

				return request;
			}
		},
		save : function(){
			var that = this;
			var data = {};
			var keys = this.keys();
			keys.forEach(function(path){
				var source = that.get(path);
				data[path] = source.get('data');
			});
			console.log('save', data);
		},
		load : function(){

			try{

			}catch(e){}
		}
	});

	module.exports = new Root();

});















