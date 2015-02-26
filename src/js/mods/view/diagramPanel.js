/**
 * @fileoverview 数据视图
 * @authors Tony Liang <pillar0514@163.com>
 */
define('mods/view/diagramPanel',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $stage = require('mods/model/stage');
	var $tpl = require('lib/kit/util/template');
	var $tip = require('mods/dialog/tip');

	var TPL = $tpl({
		box : [
			'<section class="m10 sec-ctrl" style="display:none;">',
				'<h3 class="pd1 pb10 bdb1">数据视图</h3>',
				'<div class="bdb1">',
					'<table class="pt10 pb10 pathm">',
						'<tr>',
							'<td class="name">图表：</td>',
							'<td><input data-role="data-diagram" type="text" placeholder="图表名称"/></td>',
							'<td class="add"><input data-role="add-diagram" type="button" value="添加图表"/></td>',
						'</tr>',
					'</table>',
				'</div>',
				'<div class="list" data-role="diagram-list"></div>',
			'</section>'
		]
	});

	var DiagramPanel = $view.extend({
		defaults : {
			name : 'view',
			parent : null,
			template : TPL.box,
			events : {
				'.pathm [data-role="add-diagram"] tap' : 'addDiagram',
				'.pathm [data-role="data-diagram"] keydown' : 'checkKey'
			}
		},
		build : function(){
			this.insert();
			this.checkVisible();
		},
		insert : function(){
			var conf = this.conf;
			this.role('root').appendTo($(conf.parent));
		},
		setEvents : function(action){
			var proxy = this.proxy();
			this.delegate(action);
			$stage[action]('change:currentTab', proxy('checkVisible'));
		},
		checkVisible : function(){
			var conf = this.conf;
			var root = this.role('root');
			var current = $stage.get('currentTab');
			if(conf.name === current){
				root.show();
			}else{
				root.hide();
			}
		},
		addDiagram : function(){
			var elPipeInput = this.role('data-diagram');
			var name = elPipeInput.val();
			if(!name){
				$tip('请填写图表名称');
			}else{
				this.trigger('addDiagram', name);
			}
		},
		checkKey : function(evt){
			var target = $(evt.target);
			var code = evt.keyCode + '';
			if(code === '13'){
				if(target.attr('data-role') === 'data-diagram'){
					this.addDiagram();
				}
			}
		}
	});

	module.exports = DiagramPanel;

});

