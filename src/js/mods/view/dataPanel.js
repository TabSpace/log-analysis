/**
 * @fileoverview 数据列表
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/dataPanel',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $stage = require('mods/model/stage');
	var $config = require('mods/model/config');
	var $tip = require('mods/dialog/tip');
	var $tpl = require('lib/kit/util/template');

	var TPL = $tpl({
		box : [
			'<section class="m10 bdb1 sec-ctrl" style="display:none;">',
				'<h3 class="pd1 pb10 bdb1">数据列表<span class="confp">数据路径：<cite data-role="conf-path"></cite></span></h3>',
				'<table class="bdb1 w100 pt10 pb10 pathm">',
					'<tr>',
						'<td class="name">数据路径：</td>',
						'<td class="path"><input class="w100" data-role="data-path" type="text"/></td>',
						'<td class="add"><input data-role="add-data" type="button" value="添加"/></td>',
					'</tr>',
				'</table>',
				'<div class="slist"></div>',
			'</section>'
		],
		sourceList : [

		]
	});

	var DataPanel = $view.extend({
		defaults : {
			name : 'data',
			parent : null,
			template : TPL.box,
			events : {
				'[data-role="add-data"] tap' : 'addDataSource',
				'[data-role="data-path"] keydown' : 'checkKey'
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
			var path = elPath.val().trim();
			if(!path){
				$tip('请填写数据路径');
			}else{
				this.trigger('addDataSource', path);
			}
		},
		renderDataPath : function(){
			var elConfPath = this.role('conf-path');
			elConfPath.html($config.get('dataPath'));
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

