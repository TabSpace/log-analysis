/**
 * @fileoverview 控制面板
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/controlPanel',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $stage = require('mods/model/stage');
	var $tpl = require('lib/kit/util/template');
	var $tip = require('mods/dialog/tip');

	var TPL = $tpl({
		box : [
			'<section class="m10 sec-ctrl" style="display:none;">',
				'<h3 class="pd1 pb10 bdb1">控制面板</h3>',
				'<div class="bdb1">',
					'<table class="pt10 pb10 pathm">',
						'<tr>',
							'<td class="name" colspan="3"><input data-role="reset-config" type="button" value="重置所有配置"></td>',
						'</tr>',
						'<tr>',
							'<td class="name">导入配置文件：</td>',
							'<td class="path"><input data-role="config-path" type="file" vlaue=""/></td>',
							'<td class="add"><input data-role="import-config" type="button" value="导入"/></td>',
						'</tr>',
						'<tr>',
							'<td>导出配置文件：</td>',
							'<td><input data-role="export-name" type="text" placeholder="config" value=""/>.json</td>',
							'<td><input data-role="export-config" type="button" value="保存"/></td>',
						'</tr>',
					'</table>',
				'</div>',
				'<div class="list" data-role="diagram-list"></div>',
			'</section>'
		]
	});

	var ControlPanel = $view.extend({
		defaults : {
			name : 'control',
			parent : null,
			template : TPL.box,
			events : {
				'[data-role="reset-config"] tap' : 'resetConfig',
				'[data-role="import-config"] tap' : 'importConfig',
				'[data-role="export-config"] tap' : 'exportConfig'
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
		//重置配置文件
		resetConfig : function(){
			if(confirm('确认要清除所有过滤器和图表的配置吗？')){
				this.trigger('resetConfig');
			}
		},
		//导出配置文件
		exportConfig : function(){
			var fileName = this.role('export-name').val() || 'config';
			fileName = fileName + '.json';
			this.trigger('exportConfig', fileName);
		},
		//导入配置文件
		importConfig : function(){
			var elConfigPath = this.role('config-path');
			var input = elConfigPath.get(0);
			var path = elConfigPath.val().trim();
			if(!path || !input.files.length){
				$tip('请选择配置文件');
			}else{
				this.trigger('importConfig', input.files[0]);
			}
		}
	});

	module.exports = ControlPanel;

});

