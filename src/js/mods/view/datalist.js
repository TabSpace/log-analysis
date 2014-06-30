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
			'<div class="page">',
				'<div data-role="page" class="pn"></div>',
				'<div data-role="pagelist">计算中...</div>',
			'</div>'
		],
		page : [
			'<div class="pinfo">',
				'<span>总页数：</span>',
				'<span>{{totalPage}}</span>',
			'</div>',
			'<a class="split"></a>',
			'<div class="pinfo">',
				'<span>跳转到：</span>',
				'<input type="text" value="{{page}}"/>',
			'</div>',
			'<div class="pinfo">',
				'<a data-page="{{first}}" class="{{firstEnable}}">首页</a>',
				'<a data-page="{{prev}}" class="{{prevEnable}}">上一页</a>',
				'<a data-page="{{next}}" class="{{nextEnable}}">下一页</a>',
				'<a data-page="{{last}}" class="{{lastEnable}}">末页</a>',
			'</div>',
			'<a class="split"></a>',
			'<div class="pinfo {{aroundEnable}}">{{{aroundpage}}}</div>'
		],
		around : '{{#.}}<a data-page="{{page}}" class="{{type}}">{{page}}</a>{{/.}}'
	});

	var DataList = $view.extend({
		defaults : {
			name : '',
			parent : null,
			data : null,
			template : TPL.box,
			events : {
				'a[data-page] tap' : 'checkPage'
			}
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
		checkPage : function(evt){
			var el = $(evt.currentTarget);
			var page = el.attr('data-page');
			var disabled = el.hasClass('false') || el.hasClass('current') || el.hasClass('split');
			if(disabled){return;}
			page = parseInt(page, 10) || 1;
			if(this.page){
				this.page.set('page', page);
			}
		},
		formatArrData : function(data){
			if($.isArray(data)){
				data = data.map(function(item, index){
					if($.type(item) === 'object'){
						item.index = index + 1;
						return item;
					}else{
						return {
							index : index + 1,
							value : item
						};
					}
				});
			}
			return data;
		},
		update : function(data){
			var conf = this.conf;
			if(!this.page){
				this.page = new $page({
					data : data
				});
			}
			if($.isArray(data)){
				data = this.formatArrData(data);
				this.page.set('data', data);
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
			data.aroundpage = $mustache.render(TPL.get('around'), data.around);
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

			if(!list || list.length === 0){
				listHtml = '<tr><td class="warn">列表为空</td></tr>';
			}else{
				firstItem = list[0];
				if($.type(firstItem) === 'object'){
					props = Object.keys(firstItem);
					listHead.push('<tr>');
					listTpl.push('{{#.}}<tr>');
					props.forEach(function(prop){
						listHead.push('<th>' + prop + '</th>');
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
			pageHtml = $mustache.render(pageTpl, pageData);

			if(pageData.pageEnable){
				this.role('page').show();
			}else{
				this.role('page').hide();
			}

			this.role('pagelist').html(listHtml);
			this.role('page').html(pageHtml);
		},
		renderValue : function(data){

		},
		destroy : function(){
			this.page.destroy();
			this.role('root').remove();
			delete this.page;
			DataList.superclass.destroy.apply(this,arguments);
		}
	});

	module.exports = DataList;

});

