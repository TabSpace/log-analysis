/**
 * @fileoverview 数据列表
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/dataPanel',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $stage = require('mods/model/stage');
	var $config = require('mods/model/config');

	var TPL = {
		box : [
			'<section class="box sec-ctrl" style="display:none;">',
				'<h3>数据列表<span class="confp">数据路径：<cite data-role="conf-path"></cite></span></h3>',
				'<table class="pathm">',
					'<tr>',
						'<td class="name">数据路径：</td>',
						'<td class="path"><input data-role="data-path" type="text"/></td>',
						'<td class="add"><input data-role="add-data" type="button" value="添加"/></td>',
					'</tr>',
				'</table>',
			'</section>'
		]
	};

	var DataPanel = $view.extend({
		defaults : {
			name : 'data',
			parent : null,
			template : TPL.box,
			events : {
				'[data-role="add-data"] tap' : 'addDataSource'
			}
		},
		build : function(){
			this.insert();
			this.checkVisible();
			this.renderDataPath();
		},
		insert : function(){
			var conf = this.conf;
			this.role('root').appendTo($(conf.parent));
		},
		setEvents : function(action){
			var proxy = this.proxy();
			this.delegate(action);
			$stage[action]('change:currentTab', proxy('checkVisible'));
			$config[action]('change:dataPath', proxy('renderDataPath'));
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
			var path = elPath.val();
			this.trigger('addDataSource', path);
		},
		renderDataPath : function(){
			var elConfPath = this.role('conf-path');
			elConfPath.html($config.get('dataPath'));
		}
	});

	module.exports = DataPanel;

});

