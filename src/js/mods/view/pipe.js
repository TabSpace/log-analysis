/**
 * @fileoverview 数据管道 / 过滤器
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/pipe',function(require,exports,module){

	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $mustache = require('lib/more/mustache');
	var $dataList = require('mods/view/datalist');
	var $tip = require('mods/dialog/tip');
	var $channel = require('mods/channel/global');
	var $delay = require('lib/kit/func/delay');
	var $getData = require('mods/util/getData');

	var TPL = $tpl({
		box : [
			'<div class="pt10 pb10 bdb1 pipe prepare">',
				'<div class="box header">',
					'<div class="fl">',
						'<span>名称：</span>',
						'<span data-role="name"></span>',
						'<span class="ml10" data-role="data-info"></span>',
					'</div>',
					'<div class="fr">',
						'<a class="button" data-role="pipe-toggle">显示配置</a>',
						'<a class="button" data-role="pipe-output">输出</a>',
						'<a class="button" data-role="pipe-del">移除</a>',
						'<a class="button" data-role="pipe-refresh">刷新</a>',
					'</div>',
				'</div>',
				'<div class="conf" data-role="conf" style="display:none;">',
					'<div class="mb5">',
						'<a class="button" data-role="add-entry" title="入口数据将根据下面的代码格式，作为过滤器可访问的变量">添加入口数据</a>',
						'<a class="button" data-role="output-entry" title="将变量引用的数据输出到控制台，以方便调试">输出到控制台</a>',
					'</div>',
					'<ul data-role="entries" class="entries mb10"></ul>',
					'<div class="code mb5">',
						'<textarea data-role="code" placeholder="请填入数据过滤代码"></textarea>',
					'</div>',
					'<div class="datalist" data-role="list"></div>',
				'</div>',
			'</div>'
		],
		entry : [
			'<li class="mb5">',
				'<span>',
					'var ',
					'<input type="text" name="name" value="{{name}}" placeholder="变量名"/>',
					' = ',
					'<input type="text" name="path" value="{{path}}" placeholder="选择数据"/>',
					' ;',
				'</span>',
				'<a data-role="remove-entry" title="删除" class="fr delete">-</a>',
			'</li>'
		]
	});

	var Pipe = $view.extend({
		defaults : {
			parent : null,
			model : null,
			template : TPL.box,
			events : {
				'[data-role="pipe-toggle"] tap' : 'toggleConf',
				'[data-role="add-entry"] tap' : 'addEntry',
				'[data-role="remove-entry"] tap' : 'removeEntry',
				'[data-role="output-entry"] tap' : 'outputEntry',
				'[data-role="pipe-output"] tap' : 'outputPipeData',
				'[data-role="pipe-refresh"] tap' : 'refresh'
			}
		},
		build : function(){
			var conf = this.conf;
			this.model = conf.model;
			this.insert();
			this.render = $delay(this.render, 10);
			this.render();
			this.buildList();
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
			model[action]('change:data', proxy('buildList'));
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
		refresh : function(){
			var model = this.model;
			var source = {};
			this.role('entries').find('li').each(function(){
				var li = $(this);
				var key = li.find('input[name="name"]').val();
				var value = li.find('input[name="path"]').val();
				if(key && value){
					source[key] = value;
				}
			});
			model.set('source', source);

			var filter = this.role('code').val();
			model.set('filter', filter);
		},
		outputPipeData : function(){
			window.data = this.model.get('data');
			$tip('数据输出为window.data');
			console.info('数据输出为window.data');
		},
		outputEntry : function(){
			var model = this.model;
			var source = model.get('source');
			var hasError = false;
			$.each(source, function(name, path){
				try{
					window[name] = $getData(path);
					console.info(path + ':数据输出为window.' + name);
				}catch(e){
					hasError = true;
					console.error(path + ':数据获取失败。', e.message);
				}
			});
			if(hasError){
				$tip('部分数据获取失败，详细信息参见控制台。');
			}else{
				$tip('来源数据都已输出到控制台。');
			}
		},
		addEntry : function(){
			this.addEntryNode();
		},
		addEntryNode : function(entry){
			entry = entry || {};
			var tpl = TPL.get('entry');
			var html = $mustache.render(tpl, entry);
			$(html).appendTo(this.role('entries'));
		},
		removeEntry : function(evt){
			var target = $(evt.currentTarget);
			var li = target.parent();
			li.remove();
		},
		render : function(){
			var that = this;
			var model = this.model;
			var root = this.role('root');
			var elName = this.role('name');
			var elEntries = this.role('entries');
			var elCode = this.role('code');

			root.attr('class', 'pt10 pb10 bdb1 pipe ' + model.get('state'));
			elName.html(model.get('name'));

			var source = model.get('source');
			elEntries.html('');
			$.each(source, function(name, path){
				that.addEntryNode({
					name : name,
					path : path
				});
			});

			elCode.val(model.get('filter'));
		},
		buildList : function(){
			var data = this.model.get('data');
			var count = 0;
			if($.isArray(data)){
				count = data.length;
			}else if($.isPlainObject(data)){
				count = Object.keys(data);
			}else{
				count = 1;
			}
			this.role('data-info').html('数据数量:' + count);

			if(this.list){
				this.list.update(data);
			}else{
				this.list = new $dataList({
					name : this.model.get('name'),
					parent : this.role('list'),
					data : data
				});
			}
		},
		destroy : function(){
			if(this.list){
				this.list.destroy();
				delete this.list;
			}
			this.role('root').remove();
			Pipe.superclass.destroy.apply(this,arguments);
		}
	});

	module.exports = Pipe;

});








