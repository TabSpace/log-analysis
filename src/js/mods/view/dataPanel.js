/**
 * @fileoverview 数据列表
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/dataPanel',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $stage = require('mods/model/stage');
	var $tip = require('mods/dialog/tip');
	var $tpl = require('lib/kit/util/template');

	var TPL = $tpl({
		box : [
			'<section class="m10 sec-ctrl" style="display:none;">',
				'<h3 class="pd1 pb10 bdb1">数据列表</h3>',
				'<div class="bdb1">',
					'<table class="pt10 pb10 pathm">',
						'<tr>',
							'<td class="name">数据源：</td>',
							'<td class="path"><input data-role="data-path" type="file" vlaue="添加数据"/></td>',
							'<td class="add"><input data-role="add-data" type="button" value="添加数据源"/></td>',
						'</tr>',
						'<tr>',
							'<td class="name">过滤器：</td>',
							'<td><input data-role="data-pipe" type="text" placeholder="过滤器名称"/></td>',
							'<td class="add"><input data-role="add-pipe" type="button" value="添加过滤器"/></td>',
						'</tr>',
					'</table>',
				'</div>',
				'<div class="list" data-role="source-list"></div>',
				'<div class="list" data-role="pipe-list"></div>',
			'</section>'
		]
	});

	var DataPanel = $view.extend({
		defaults : {
			name : 'data',
			parent : null,
			template : TPL.box,
			events : {
				'[data-role="add-data"] tap' : 'addDataSource',
				'[data-role="data-path"] keydown' : 'checkKey',
				'[data-role="add-pipe"] tap' : 'addPipe'
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
		addDataSource : function(){
			var elPath = this.role('data-path');
			var input = elPath.get(0);
			var path = elPath.val().trim();
			if(!path || !input.files.length){
				$tip('请选择数据文件');
			}else{
				this.trigger('addDataSource', path, input.files[0]);
			}
		},
		addPipe : function(){
			var elPipeInput = this.role('data-pipe');
			var name = elPipeInput.val();
			if(!name){
				$tip('请填写过滤器名称');
			}else{
				this.trigger('addPipe', name);
			}
		},
		checkKey : function(evt){
			var code = evt.keyCode + '';
			if(code === '13'){
				this.addDataSource();
			}
		}
	});

	module.exports = DataPanel;

});

