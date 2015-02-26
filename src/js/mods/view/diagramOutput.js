/**
 * @fileoverview 最终输出的图表
 * @authors Tony Liang <pillar0514@163.com>
 */
define('mods/view/diagramOutput',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $stage = require('mods/model/stage');
	var $tpl = require('lib/kit/util/template');
	var $tip = require('mods/dialog/tip');
	var $diagramModel = require('mods/model/diagram');
	var $diagramView = require('mods/view/diagram');

	var TPL = $tpl({
		box : [
			'<section class="m10 sec-ctrl">',
				'<h3 class="pd1 pb10 bdb1" data-role="title"></h3>',
				'<div class="list" data-role="diagram-list"></div>',
			'</section>'
		]
	});

	var DiagramOutput = $view.extend({
		defaults : {
			title : '图表',
			name : 'view',
			parent : null,
			template : TPL.box
		},
		build : function(){
			this.insert();
			this.render();
		},
		insert : function(){
			var conf = this.conf;
			this.role('root').appendTo($(conf.parent));
		},
		render : function(){
			var conf = this.conf;
			this.role('title').html(conf.title);
		},
		addDiagram : function(conf){
			var diagramBox = this.role('diagram-list');
			var model = new $diagramModel(conf);
			var diagram = new $diagramView({
				hideOperation : true,
				parent : diagramBox,
				model : model
			});
		}
	});

	module.exports = DiagramOutput;

});

