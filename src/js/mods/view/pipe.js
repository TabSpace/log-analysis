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
			'<div class="pt10 pb10 bdb1">',
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
				'<div data-role="conf" style="display:none;">',
					'<div>',
						'<input type="button" value="添加数据入口">',
					'</div>',
					'<ul>',
						'<li>',
							'<span>',
								'var ',
								'<input type="text" value="" placeholder="变量名"/>',
								' = ',
								'<select value="">',
									'<option value="">""</option>',
								'</select>',
								';',
							'</span>',
							'<a title="删除">-</a>',
						'</li>',
					'</ul>',
					'<div data-role="list"></div>',
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
			console.log('build');
			var conf = this.conf;
			this.model = conf.model;
			this.insert();
		},
		insert : function(){
			var conf = this.conf;
			console.log('insert', conf.parent);
			this.role('root').appendTo($(conf.parent));
		},
		setEvents : function(action){
			this.delegate(action);
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
		}
	});

	module.exports = Pipe;

});