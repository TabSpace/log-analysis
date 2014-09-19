/**
 * @fileoverview 控制面板
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/controlPanel',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $stage = require('mods/model/stage');
	var $tpl = require('lib/kit/util/template');

	var TPL = $tpl({
		box : [
			'<section class="m10 sec-ctrl" style="display:none;">',
				'<h3 class="pd1 pb10 bdb1">控制面板</h3>',
				'<div class="bdb1">',
					'<table class="pt10 pb10 pathm">',
						'<tr>',
							'<td class="name">导入配置文件：</td>',
							'<td class="path"><input data-role="config-path" type="file" vlaue=""/></td>',
							'<td class="add"><input data-role="import-config" type="button" value="导入"/></td>',
						'</tr>',
						'<tr>',
							'<td class="name" colspan="3"><input data-role="data-pipe" type="button" value="导出配置文件"/></td>',
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
			template : TPL.box
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
		}
	});

	module.exports = ControlPanel;

});

