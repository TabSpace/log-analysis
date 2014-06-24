/**
 * @fileoverview 菜单
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/menu',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $stage = require('mods/model/stage');
	var $tpl = require('lib/kit/util/template');

	var TPL = $tpl({
		box : [
			'<section class="m10 sec-menu">',
				'<ul class="bdb1">',
					'<li class="current" data-role="data">数据</li>',
					'<li data-role="view">视图</li>',
					'<li data-role="control">控制</li>',
				'</ul>',
			'</section>'
		]
	});

	var Menu = $view.extend({
		defaults : {
			parent : null,
			template : TPL.box,
			events : {
				'li tap' : 'switchTab'
			}
		},
		build : function(){
			this.insert();
		},
		insert : function(){
			var conf = this.conf;
			this.role('root').appendTo($(conf.parent));
		},
		setEvents : function(action){
			var proxy = this.proxy();
			this.delegate(action);
			$stage[action]('change:currentTab', proxy('checkTab'));
		},
		switchTab : function(evt){
			var li = $(evt.currentTarget);
			var role = li.attr('data-role');
			$stage.set('currentTab', role);
		},
		checkTab : function(){
			var role = $stage.get('currentTab');
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

