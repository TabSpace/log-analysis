/**
 * @fileoverview 图表
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/view/diagram',function(require,exports,module){

	var $tpl = require('lib/kit/util/template');
	var $tip = require('mods/dialog/tip');
	var $channel = require('mods/channel/global');
	var $pipeView = require('mods/view/pipe');
	var $charts = require('mods/util/charts');
	var $delay = require('lib/kit/func/delay');

	var TPL = $tpl({
		box : [
			'<div class="pt10 pb10 bdb1 diagram prepare">',
				'<div class="box header">',
					'<div class="fl">',
						'<span>名称：</span>',
						'<span data-role="name"></span>',
						'<span class="ml10" data-role="data-info"></span>',
					'</div>',
				'</div>',
				'<div class="chart-box">',
					'<div class="chart" data-role="chart"></div>',
				'</div>',
				'<div class="datalist" data-role="list"></div>',
				'<div class="box header" data-role="operation">',
					'<div class="fr">',
						'<a class="button" data-role="toggle-data">隐藏数据</a>',
						'<a class="button" data-role="toggle-conf">显示配置</a>',
						'<a class="button" data-role="output-data">输出</a>',
						'<a class="button" data-role="del">移除</a>',
						'<a class="button" data-role="refresh">刷新</a>',
					'</div>',
				'</div>',
				'<div class="conf" data-role="conf" style="display:none;">',
					'<div class="mb5">',
						'选择图表类型：<select data-role="chart-type"><option value="">无</option></select>',
					'</div>',
					'<form data-role="chart-conf" class="mb10" style="display:none;"></form>',
					'<div class="mb5">',
						'<a class="button" data-role="add-entry" title="入口数据将根据下面的代码格式，作为过滤器可访问的变量">添加入口数据</a>',
						'<a class="button" data-role="output-entry" title="将变量引用的数据输出到控制台，以方便调试">输出到控制台</a>',
					'</div>',
					'<ul data-role="entries" class="entries mb10"></ul>',
					'<div class="code mb5">',
						'<textarea data-role="code" placeholder="请填入数据过滤代码"></textarea>',
					'</div>',
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

	var Diagram = $pipeView.extend({
		defaults : {
			parent : null,
			model : null,
			template : TPL.box,
			hideOperation : false,
			hideSinglePage : true,
			events : {
				'[data-role="toggle-data"] tap' : 'toggleData',
				'[data-role="toggle-conf"] tap' : 'toggleConf',
				'[data-role="add-entry"] tap' : 'addEntry',
				'[data-role="remove-entry"] tap' : 'removeEntry',
				'[data-role="output-entry"] tap' : 'outputEntry',
				'[data-role="output-data"] tap' : 'outputData',
				'[data-role="refresh"] tap' : 'refresh',
				'[data-role="del"] tap' : 'remove',
				'[data-role="chart-type"] change' : 'updateChartOptions'
			}
		},
		build : function(){
			var conf = this.conf;
			this.model = conf.model;
			this.insert();
			this.render = $delay(this.render, 20);
			this.updateState = $delay(this.updateState, 20);
			this.render();
			this.renderChartTypes();
			this.renderOperations();
			this.buildList();
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
			var model = this.model;
			model[action]('change', proxy('render'));
			model[action]('change:data', proxy('buildList'));
		},
		toggleData : function(){
			var model = this.model;
			model.set('dataVisible', !model.get('dataVisible'));
		},
		//更新过滤器的状态样式
		updateState : function(){
			this.role('root').attr(
				'class',
				'pt10 pb10 bdb1 diagram ' +
					this.model.get('state')
			);
			this.renderDataVisible();
			this.renderChart();
			this.renderChartConf();
		},
		//渲染操作列表
		renderOperations : function(){
			var conf = this.conf;
			if(conf.hideOperation){
				this.role('operation').hide();
			}
		},
		//渲染数据表是否显示隐藏
		renderDataVisible : function(){
			var dataVisible = this.model.get('dataVisible');
			var elToggleData = this.role('toggle-data');
			var elList = this.role('list');
			if(dataVisible){
				elList.show();
				elToggleData.html('隐藏数据');
			}else{
				elList.hide();
				elToggleData.html('显示数据');
			}
		},
		//渲染图表类型下拉列表
		renderChartTypes : function(){
			var elChartType = this.role('chart-type');
			var select = elChartType.get(0);
			var types = $charts.getTypes();

			types.forEach(function(item){
				select.options.add(new Option(item.name, item.type));
			});
		},
		//渲染图表的配置项
		renderChartConf : function(){
			var chartConf = this.model.get('chart');
			var elChartType = this.role('chart-type');
			var elChartConf = this.role('chart-conf');
			var chartConfHtml = '';
			if(!chartConf || !chartConf.type){
				elChartType.val('');
				elChartConf.html('');
				elChartConf.hide();
			}else{
				elChartType.val(chartConf.type);
				if(this.chart){
					chartConfHtml = $charts.getOptionsHtml(chartConf.type, chartConf);
					this.chart.getOptionsHtml(chartConf);
				}
				elChartConf.html(chartConfHtml);
				elChartConf.show();
			}
		},
		//构建图表
		renderChart : function(){
			var chartConf = this.model.get('chart');
			var elChart = this.role('chart');
			if(!chartConf || !chartConf.type){
				elChart.html('');
				elChart.hide();
			}else{
				elChart.show();
				chartConf.node = elChart.get(0);
				chartConf.dataMap = this.model.get('data');
				this.chart = $charts.build(chartConf.type, chartConf);
			}
		},
		refresh : function(){
			this.refreshSource();
			this.refreshFilter();
			this.updateChartOptions();
			this.model.compute();
		},
		//更新图表选项
		updateChartOptions : function(){
			var model = this.model;
			var elChartType = this.role('chart-type');
			var elChartConf = this.role('chart-conf');
			var select = elChartType.get(0);
			var chartConf = {};

			if(!elChartType.val()){
				model.set('chart', null);
			}else{
				chartConf.type = elChartType.val();
				chartConf = $charts.readOptions(chartConf.type, elChartConf);
				model.set('chart', chartConf);
			}
		},
		//移除数据源
		remove : function(){
			if(window.confirm('确认要移除这个图表吗？')){
				$channel.trigger('remove-diagram', this.model.get('name'));
				this.destroy();
			}
		}
	});

	module.exports = Diagram;

});








