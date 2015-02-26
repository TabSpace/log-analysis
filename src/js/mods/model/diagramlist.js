/**
 * @fileoverview 图表对象集合
 * @authors Tony Liang <pillar0514@163.com>
 */
define('mods/model/diagramlist',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $diagram = require('mods/model/diagram');
	var $channel = require('mods/channel/global');
	var $delay = require('lib/kit/func/delay');

	var DIAGRAM_LIST_NAME = 'DIAGRAM_LIST_DATA';

	var DiagramList = $model.extend({
		defaults : {

		},
		events : {
			'change' : 'save'
		},
		build : function(){
			this.save = $delay(this.save, 50);
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
			$channel[action]('load-data', proxy('load'));
		},
		getDiagram : function(name){
			return this.get(name);
		},
		addDiagram : function(name, diagramConf){
			var that = this;

			diagramConf = diagramConf || {};
			diagramConf.name = name;
			delete diagramConf.state;
			delete diagramConf.ready;
			var diagram = new $diagram(diagramConf);

			diagram.on('change', function(){
				that.trigger('change');
			});
			diagram.on('destroy', function(){
				that.removeDiagram(name);
			});
			this.set(name, diagram);
			return diagram;
		},
		removeDiagram : function(name){
			this.remove(name);
		},
		getConf : function(){
			var configs = {};
			var data = this.get();
			$.each(data, function(name, obj){
				var conf = obj.get();
				delete conf.data;
				configs[name] = conf;
			});
			return configs;
		},
		save : function(){
			var storeData = this.getConf();
			try{
				localStorage.setItem(DIAGRAM_LIST_NAME, JSON.stringify(storeData));
			}catch(e){
				console.error('Save diagramlist error:', e.message);
			}
		},
		load : function(){
			var data = {};
			try{
				data = localStorage.getItem(DIAGRAM_LIST_NAME);
				data = JSON.parse(data);
			}catch(e){
				console.error('Load diagramlist error:', e.message);
			}
			if(!data){
				data = {};
			}
			setTimeout(function(){
				$channel.trigger('load-diagrams', data);
			});
		}
	});

	module.exports = window.globalDiagramList = new DiagramList();

});










