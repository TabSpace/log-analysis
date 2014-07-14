/**
 * @fileoverview 数据源
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/source',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $mustache = require('lib/more/mustache');
	var $dataList = require('mods/view/datalist');
	var $tip = require('mods/dialog/tip');
	var $channel = require('mods/channel/global');

	var TPL = $tpl({
		box : [
			'<div class="pt10 pb10 bdb1 source">',
				'<div class="box header">',
					'<div class="fl">',
						'<span>数据源：</span>',
						'<span data-role="source-path"></span>',
						'<span class="ml10" data-role="data-info"></span>',
					'</div>',
					'<div class="fr">',
						'<a class="button" data-role="source-toggle">显示列表</a>',
						'<a class="button" data-role="source-output" title="将数据输出到控制台">输出</a>',
						'<a class="button" data-role="source-del">移除</a>',
						'<a class="button" data-role="source-refresh">刷新</a>',
					'</div>',
				'</div>',
				'<div data-role="list" style="display:none;"></div>',
			'</div>'
		]
	});

	var Source = $view.extend({
		defaults : {
			parent : null,
			model : null,
			template : TPL.box,
			events : {
				'[data-role="source-toggle"] tap' : 'toggleList',
				'[data-role="source-output"] tap' : 'outputToConsole',
				'[data-role="source-del"] tap' : 'remove',
				'[data-role="source-refresh"] tap' : 'refresh'
			}
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
		toggleList : function(){
			var button = this.role('source-toggle');
			var list = this.role('list');
			if(list.css('display') === 'none'){
				list.show();
				button.html('隐藏列表');
			}else{
				list.hide();
				button.html('显示列表');
			}
		},
		//显示数据源的路径
		renderPath : function(){
			this.role('source-path').html(this.model.get('path'));
		},
		//构造数据列表
		buildList : function(){
			var data = this.model.get('data');
			
			var count = 0;
			if($.isArray(data)){
				count = data.length;
			}else if($.isPlainObject(data)){
				count = Object.keys(data);
			}else{
				count = 1;
			}
			this.role('data-info').html('数据数量:' + count);

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
		//讲数据输出到控制台
		outputToConsole : function(){
			window.data = this.model.get('data');
			$tip('数据输出为window.data');
		},
		//移除数据源
		remove : function(){
			if(window.confirm('确认要移除数据源吗？')){
				$channel.trigger('remove-source', this.model.get('path'));
				this.destroy();
			}
		},
		//刷新数据源，并更新依赖该数据源的所有管道对象
		refresh : function(){
			$tip('更新依赖此数据源的所有数据...');
		},
		destroy : function(){
			this.list.destroy();
			delete this.list;
			this.role('root').remove();
			Source.superclass.destroy.apply(this,arguments);
		}
	});

	module.exports = Source;

});