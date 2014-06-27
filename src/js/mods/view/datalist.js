/**
 * @fileoverview 数据列表
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/datalist',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $mustache = require('lib/more/mustache');
	var $page = require('mods/model/page');

	var TPL = $tpl({
		box : [
			'<div class="datalist">',
				'<div data-role="pagelist">pagelist</div>',
				'<div data-role="page">page</div>',
			'</div>'
		],
		list : [

		],
		page : [

		]
	});

	var DataList = $view.extend({
		defaults : {
			parent : null,
			data : null,
			template : TPL.box
		},
		build : function(){
			var conf = this.conf;
			this.insert();
			this.page = new $page({
				data : conf.data
			});
			this.renderList();
			this.renderPage();
		},
		insert : function(){
			var conf = this.conf;
			this.role('root').appendTo($(conf.parent));
		},
		setEvents : function(action){
			var proxy = this.proxy();
			var page = this.page;
			this.delegate(action);
			page[action]('change', proxy('renderList'));
			page[action]('change', proxy('renderPage'));
		},
		update : function(data){
			this.page.set('data', data);
		},
		renderList : function(){

		},
		renderPage : function(){

		},
		destroy : function(){
			DataList.superclass.destroy.apply(this,arguments);
			this.page.destroy();
			delete this.page;
		}
	});

	module.exports = DataList;

});

