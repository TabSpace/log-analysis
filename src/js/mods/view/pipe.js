/**
 * @fileoverview 数据管道 / 过滤器
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/pipe',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $mustache = require('lib/more/mustache');

	var TPL = $tpl({
		box : [
			'<div class="pt10 pb10 bdb1 pipe">',
				'<div class="box header">',
					'<div class="fl">',
						'<span>名称：</span>',
						'<span data-role="name"></span>',
						'<span class="ml10" data-role="data-info"></span>',
					'</div>',
					'<div class="fr">',
						'<a class="button" data-role="pipe-toggle">显示配置</a>',
						'<a class="button" data-role="pipe-output" title="将数据输出到控制台">输出</a>',
						'<a class="button" data-role="pipe-del">移除</a>',
						'<a class="button" data-role="pipe-refresh">刷新</a>',
					'</div>',
				'</div>',
				'<div class="conf" data-role="conf" style="display:none;">',
					'<div class="mb5">',
						'<a class="button" data-role="add-data">添加入口数据</a>',
					'</div>',
					'<ul class="variables mb10">',
						'<li class="mb5">',
							'<span>',
								'var ',
								'<input type="text" value="" placeholder="变量名"/>',
								' = ',
								'<input type="text" value="" placeholder="选择数据"/>',
								' ;',
							'</span>',
							'<a title="删除" class="fr delete">-</a>',
						'</li>',
						'<li class="mb5">',
							'<span>',
								'var ',
								'<input type="text" value="" placeholder="变量名"/>',
								' = ',
								'<input type="text" value="" placeholder="选择数据"/>',
								' ;',
							'</span>',
							'<a title="删除" class="fr delete">-</a>',
						'</li>',
					'</ul>',
					'<div class="code mb5">',
						'<textarea placeholder="请填入数据过滤代码"></textarea>',
					'</div>',
					'<div class="datalist" data-role="list"></div>',
				'</div>',
			'</div>'
		]
	});

	var Pipe = $view.extend({
		defaults : {
			parent : null,
			model : null,
			template : TPL.box,
			events : {
				'[data-role="pipe-toggle"] tap' : 'toggleConf'
			}
		},
		build : function(){
			var conf = this.conf;
			this.model = conf.model;
			this.insert();
			this.render();
		},
		insert : function(){
			var conf = this.conf;
			this.role('root').appendTo($(conf.parent));
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
			var model = this.model;
			model[action]('change', proxy('render'));
		},
		toggleConf : function(){
			var button = this.role('pipe-toggle');
			var box = this.role('conf');
			if(box.css('display') === 'none'){
				box.show();
				button.html('隐藏配置');
			}else{
				box.hide();
				button.html('显示配置');
			}
		},
		render : function(){
			var model = this.model;
			this.role('name').html(model.get('name'));
		}
	});

	module.exports = Pipe;

});