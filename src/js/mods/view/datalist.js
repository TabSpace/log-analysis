/**
 * @fileoverview 数据列表
 * @authors Tony Liang <pillar0514@163.com>
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
				'<div data-role="pagelist" class="pl">计算中...</div>',
			'</div>'
		],
		page : [
			'<div class="pinfo mb5 mr5">',
				'<span>总页数：</span>',
				'<span>{{totalPage}}</span>',
			'</div>',
			'<a class="split mb5"></a>',
			'<div class="pinfo mb5 mr5">',
				'<span>跳转到：</span>',
				'<input type="text" value="{{page}}"/>',
			'</div>',
			'<div class="pinfo mb5 mr5">',
				'<a data-page="{{first}}" class="{{firstEnable}}">首页</a>',
				'<a data-page="{{prev}}" class="{{prevEnable}}">上一页</a>',
				'<a data-page="{{next}}" class="{{nextEnable}}">下一页</a>',
				'<a data-page="{{last}}" class="{{lastEnable}}">末页</a>',
			'</div>',
			'<a class="split mb5"></a>',
			'<div class="mb5 pinfo {{aroundEnable}}">{{{aroundpage}}}</div>'
		],
		around : '{{#.}}<a data-page="{{page}}" class="{{type}}">{{page}}</a>{{/.}}'
	});

	var DataList = $view.extend({
		defaults : {
			name : '',
			parent : null,
			data : null,
			template : TPL.box,
			hideSinglePage : false,
			events : {
				'a[data-page] tap' : 'checkPage',
				'input keydown' : 'checkKey'
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
		//检查页码
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
		//检查按键，如果是enter，则设置页码
		checkKey : function(evt){
			var keyCode = evt.keyCode + '';
			if(keyCode !== '13'){return;}
			var el = $(evt.currentTarget);
			var value = el.val();
			var page = parseInt(value, 10) || 1;
			if(this.page){
				this.page.set('page', page);
			}
		},
		//格式化数组数据
		formatArrData : function(data){
			if($.isArray(data)){
				data = data.map(function(item, index){
					if($.type(item) === 'object'){
						return item;
					}else{
						return {value : item};
					}
				});
			}
			return data;
		},
		//更新列表的数据
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
				this.renderPage();
			}else{
				this.renderValue(data);
			}
		},
		//获取分页数据
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
		//渲染列表的一页数据
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
					console.warn(conf.name + ':datalist数据格式错误 -> firstItem:', firstItem);
				}
			}

			listHtml = [
				'<table ',
					'style="counter-reset:table ',
					(pageData.page - 1)  * pageData.pageSize,
				'">',
					listHtml,
				'</table>'
			].join('');
			pageHtml = $mustache.render(pageTpl, pageData);

			if(conf.hideSinglePage && pageData.totalPage <= 1){
				pageHtml = '';
			}

			if(pageData.pageEnable){
				this.role('page').show();
			}else{
				this.role('page').hide();
			}

			this.role('pagelist').html(listHtml);
			this.role('page').html(pageHtml);
		},
		//渲染列表的某个值
		renderValue : function(data){
			var elPageList = this.role('pagelist');
			if($.isPlainObject(data)){
				elPageList.html(JSON.stringify(data));
			}else{
				elPageList.html('' + data);
			}
			this.role('page').html('');
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

