/**
 * @fileoverview 菜单
 * @authors Tony Liang <pillar0514@163.com>
 */
define('mods/view/menu',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $stage = require('mods/model/stage');
	var $tpl = require('lib/kit/util/template');
	var $channel = require('mods/channel/global');

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
			$channel[action]('switch-tab-to', proxy('switchTabTo'));
		},
		switchTabTo : function(role){
			$stage.set('currentTab', role);
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

