/**
 * @fileoverview 数据源
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/source',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $mustache = require('lib/more/mustache');
	var $dataList = require('mods/view/datalist');

	var TPL = $tpl({
		box : [
			'<div class="pt10 pb10 bdb1">',
				'<div class="box header">',
					'<div class="fl">',
						'<span>数据源路径：</span>',
						'<span data-role="source-path"></span>',
					'</div>',
					'<div class="fr">',
						'<a class="button" data-role="source-del">移除</a>',
						'<a class="button" data-role="source-refresh">刷新</a>',
					'</div>',
				'</div>',
				'<div data-role="list"></div>',
			'</div>'
		]
	});

	var Source = $view.extend({
		defaults : {
			parent : null,
			model : null,
			template : TPL.box
		},
		build : function(){
			var conf = this.conf;
			this.model = conf.model;
			this.insert();
			this.renderPath();
			this.buildList();
		},
		insert : function(){
			var conf = this.conf;
			this.role('root').appendTo($(conf.parent));
		},
		setEvents : function(action){
			var proxy = this.proxy();
			var model = this.model;
			this.delegate(action);
			model[action]('change:path', proxy('renderPath'));
			model[action]('change:data', proxy('buildList'));
		},
		renderPath : function(){
			this.role('source-path').html(this.model.get('path'));
		},
		buildList : function(){
			var data = this.model.get('data');
			if(this.list){
				this.list.update(data);
			}else{
				this.list = new $dataList({
					name : this.model.get('path'),
					parent : this.role('list'),
					data : data
				});
			}
		},
		destroy : function(){
			this.list.destroy();
			delete this.list;
			Source.superclass.destroy.apply(this,arguments);
		}
	});

	module.exports = Source;

});