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
				'<div data-role="pagelist">计算中...</div>',
				'<div data-role="page"></div>',
			'</div>'
		],
		page : [

		]
	});

	var DataList = $view.extend({
		defaults : {
			name : '',
			parent : null,
			data : null,
			template : TPL.box
		},
		build : function(){
			var conf = this.conf;
			this.insert();
			this.update(conf.data);
		},
		insert : function(){
			var conf = this.conf;
			this.role('root').appendTo($(conf.parent));
		},
		setEvents : function(action){
			var proxy = this.proxy();
			var page = this.page;
			this.delegate(action);
			if(page){
				page[action]('change', proxy('renderPage'));
			}
		},
		formatArrData : function(data){
			if($.isArray(data)){
				data = data.map(function(item, index){
					if($.type(item) === 'object'){
						item.i = index + 1;
						return item;
					}else{
						return {
							i : index + 1,
							value : item
						};
					}
				});
			}
			return data;
		},
		update : function(data){
			var conf = this.conf;
			if($.isArray(data)){
				data = this.formatArrData(data);
				if(!this.page){
					this.page = new $page({
						data : data
					});
					this.renderPage();
				}else{
					this.page.set('data', data);
				}
			}else{
				this.renderValue(data);
			}
		},
		getPageData : function(){
			var page = this.page;
			var data = {};
			[
				'page','totalCount','totalPage','pageSize',
				'prev','next','first','last',
				'around','list','pageEnable',
				'firstEnable','lastEnable','prevEnable',
				'nextEnable','aroundEnable'
			].forEach(function(prop){
				data[prop] = page.get(prop);
			});
			return data;
		},
		renderPage : function(){
			var conf = this.conf;
			var pageData = this.getPageData();
			var list = pageData.list;
			var listHtml = '';
			var pageHtml = '';
			var listHead = [];
			var listTpl = [];
			var pageTpl = TPL.get('page');
			var firstItem;
			var props;


			console.log('pageData', pageData);

			if(!list || list.length === 0){
				listHtml = '<tr><td class="warn">列表为空</td></tr>';
			}else{
				firstItem = list[0];
				if($.type(firstItem) === 'object'){
					props = Object.keys(firstItem);
					listHead.push('<tr>');
					listTpl.push('{{#.}}<tr>');
					props.forEach(function(prop){
						listHead.push('<td>' + prop + '</td>');
						listTpl.push('<td>{{' + prop + '}}</td>');
					});
					listHead.push('</tr>');
					listTpl.push('</tr>{{/.}}');
					listHtml = listHead.join('') + $mustache.render(listTpl.join(''), list);
				}else{
					listHtml = '<tr><td class="warn">数据格式错误</td></tr>';
					console.log(conf.name + ':datalist数据格式错误:firstItem:', firstItem);
				}
			}

			listHtml = '<table>' + listHtml + '</table>';

			this.role('pagelist').html(listHtml);
			this.role('page').html(pageHtml);

		},
		renderValue : function(data){

		},
		destroy : function(){
			DataList.superclass.destroy.apply(this,arguments);
			this.page.destroy();
			delete this.page;
		}
	});

	module.exports = DataList;

});

