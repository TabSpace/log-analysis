/**
 * @fileoverview 菜单
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/menu',function(require,exports,module){

	var $view = require('lib/mvc/view');

	var TPL = {
		box : [
			'<section class="sec-menu">',
				'<ul>',
					'<li class="current" data-role="data">数据</li>',
					'<li data-role="view">视图</li>',
					'<li data-role="control">控制</li>',
				'</ul>',
			'</section>'
		]
	};

	var Menu = $view.extend({
		defaults : {
			stage : null,
			parent : null,
			template : TPL.box,
			events : {
				'li tap' : 'switchTab'
			}
		},
		build : function(){
			this.stage = this.conf.stage;
			this.insert();
		},
		insert : function(){
			var conf = this.conf;
			this.role('root').appendTo($(conf.parent));
		},
		setEvents : function(action){
			var stage = this.stage;
			var proxy = this.proxy();
			this.delegate(action);
			stage[action]('change:currentTab', proxy('checkTab'));
		},
		switchTab : function(evt){
			var li = $(evt.currentTarget);
			var role = li.attr('data-role');
			this.stage.set('currentTab', role);
		},
		checkTab : function(){
			var stage = this.stage;
			var role = stage.get('currentTab');
			this.role('root').find('li').each(function(){
				var el = $(this);
				if(el.attr('data-role') === role){
					el.addClass('current');
				}else{
					el.removeClass('current');
				}
			});
		}
	});

	module.exports = Menu;

});

