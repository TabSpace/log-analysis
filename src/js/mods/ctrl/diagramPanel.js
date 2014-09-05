/**
 * @fileoverview 数据视图
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/ctrl/diagramPanel',function(require,exports,module){

	var $controller = require('lib/mvc/controller');
	var $diagramPanelView = require('mods/view/diagramPanel');
	var $config = require('mods/model/config');
	var $channel = require('mods/channel/global');
	var $diagramlist = require('mods/model/diagramlist');
	var $diagramView = require('mods/view/diagram');
	var $tip = require('mods/dialog/tip');

	var DiagramPanel = $controller.extend({
		defaults : {
			parent : null
		},
		build : function(){
			var conf = this.conf;
			var objs = this.objs;
			objs.view = new $diagramPanelView({
				parent : conf.parent
			});
		},
		setEvents : function(action){
			var objs = this.objs;
			var proxy = this.proxy();
			this.delegate(action);
			objs.view[action]('addDiagram', proxy('addDiagram'));
			$channel[action]('remove-diagram', proxy('removeDiagram'));
			$channel[action]('load-diagrams', proxy('loadDiagrams'));
		},
		addDiagram : function(name, diagramConf){
			var objs = this.objs;
			var diagram = $diagramlist.get(name);
			var diagramBox = objs.view.role('diagram-list');

			if(diagram){
				$tip('已存在同名图表');
			}else{
				diagram = $diagramlist.addDiagram(name, diagramConf);
			}

			var diagramView = objs['diagram-' + name];
			if(!diagramView){
				diagramView = objs['diagram-' + name] = new $diagramView({
					parent : diagramBox,
					model : diagram
				});
			}
		},
		removeDiagram : function(name){
			if(this.objs['diagram-' + name]){
				this.objs['diagram-' + name].destroy();
			}
			delete this.objs['diagram-' + name];
			$diagramlist.removeDiagram(name);
		},
		loadDiagrams : function(data){
			var that = this;
			$.each(data, function(name, diaramConf){
				if(name && diaramConf){
					that.addDiagram(name, diaramConf);
				}
			});
		}
	});

	module.exports = DiagramPanel;

});

