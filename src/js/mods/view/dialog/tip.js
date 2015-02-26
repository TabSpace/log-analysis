/**
 * @fileoverview 对话框 - 提示
 * @authors Tony Liang <pillar0514@163.com>
 */

define('mods/view/dialog/tip',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');

	var TPL = {
		root : '<div></div>'
	};

	var TipBox = $view.extend({
		defaults : {
			node : TPL.root,
			styles : {
				'z-index' : 1000,
				'background-color' : 'rgba(0,0,0,0.7)',
				'color' : '#fff',
				'position' : 'fixed',
				'padding' : '10px 15px',
				'box-shadow' : '0 0 5px #999',
				'top' : '20px',
				'left' : '50%',
				'white-space' : 'nowrap',
				'transform' : 'translateX(-50%) translateY(-80px)',
				'display' : 'none',
				'overflow' : 'hidden'
			}
		},
		build : function(){
			var conf = this.conf;
			var root = this.role('root');
			this.model = conf.model;
			root.css(conf.styles).appendTo(document.body);
		},
		setEvents : function(action){
			var proxy = this.proxy();
			var model = this.model;
			this.delegate(action);
			model.on('change:tip', proxy('render'));
			model.on('change:visible', proxy('checkVisible'));
		},
		checkVisible : function(){
			var visible = this.model.get('visible');
			if(visible){
				this.show();
			}else{
				this.hide();
			}
		},
		render : function(){
			var tip = this.model.get('tip');
			this.role('root').html(tip);
		},
		show : function(){
			var root = this.role('root');
			root.show().transit({
				'translateX' : '-50%',
				'translateY' : 0
			}, 300, 'ease-out');
		},
		hide : function(){
			var that = this;
			var root = this.role('root');
			root.transit({
				'translateX' : '-50%',
				'translateY' : '-80px'
			}, 300, 'ease-out', function(){
				if(!that.model.get('visible')){
					root.hide();
				}
			});
		}
	});

	module.exports = TipBox;

});
