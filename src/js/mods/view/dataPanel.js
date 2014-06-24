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
	var $root = require('mods/model/root');
	var $mustache = require('lib/more/mustache');

	var TPL = $tpl({
		box : [
			'<section class="m10 sec-ctrl" style="display:none;">',
				'<h3 class="pd1 pb10 bdb1">数据列表</h3>',
				'<div class="bdb1">',
					'<table class="pt10 pb10 pathm">',
						'<tr>',
							'<td class="name">数据源：</td>',
							'<td class="path"><input data-role="data-path" type="file" vlaue="添加数据"/></td>',
							'<td class="add"><input data-role="add-data" type="button" value="添加"/></td>',
						'</tr>',
					'</table>',
				'</div>',
				'<div class="pt10 pb10 list" data-role="source-list"></div>',
				'<div class="pt10 pb10 list" data-role="pipe-list"></div>',
			'</section>'
		],
		sourceList : [
			'<table>',
				'<tr>',
					'<th>路径</th>',
					'<th>数据量</th>',
					'<th>操作</th>',
				'</tr>',
				'{{#.}}',
				'<tr>',
					'<td data-role="source-path">{{path}}</td>',
					'<td>{{count}}</td>',
					'<td>',
						'<a class="button" data-role="source-del">移除</a>',
						'<a class="button" data-role="source-generate">生成</a>',
					'</td>',
				'</tr>',
				'{{/.}}',
			'</table>'
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
				'[data-role="source-del"] tap' : 'delDataSource',
				'[data-role="source-generate"] tap' : 'generatePipeData'
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
			$root[action]('change', proxy('renderSourceList'));
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
		renderSourceList : function(){
			var template = TPL.get('sourceList');
			var pathes = $root.keys();
			var elSourceList = this.role('source-list');
			if(pathes.length){
				elSourceList.show();
			}else{
				elSourceList.hide();
			}
			pathes = pathes.map(function(path){
				var item = {};
				var data = $root.get(path);
				item.path = path;
				item.count = $.isArray(data.get('data')) ? data.get('data').length : 0;
				return item;
			});
			var html = $mustache.render(template, pathes);
			elSourceList.html(html);
		},
		checkKey : function(evt){
			var code = evt.keyCode + '';
			if(code === '13'){
				this.addDataSource();
			}
		},
		getSourceData : function(evt){
			var target = $(evt.currentTarget);
			var tr = target.parents('tr');
			var pathNode = tr.find('[data-role="source-path"]');
			var path = pathNode.html();
			return $root.get(path);
		},
		generatePipeData : function(evt){

		},
		delDataSource : function(evt){
			var data = this.getSourceData(evt);
			var path = data.get('path');
			$root.removeData(path);
		}
	});

	module.exports = DataPanel;

});

