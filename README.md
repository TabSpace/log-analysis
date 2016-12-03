#log-analysis
[![dependencies](https://david-dm.org/tabspace/log-analysis.png)](http://david-dm.org/tabspace/log-analysis)

通过自定义日志模板分析日志文件，可自由搭配数据生成图表。

## Guide

0. 这是一个 grunt 插件, 所以你需要先安装 [Grunt](http://gruntjs.com/)
	
	参考 [Grunt Getting Started](http://gruntjs.com/getting-started) 

0. 安装本插件

	```shell
	npm install log-analysis --save-dev
	```

0. 把数据文件 data.txt 存放到当前目录

	配置 data.txt 数据如下，确保文件没有空行
	
	```txt
	1
	2
	3
	```

0. 用**chrome**浏览器打开 node_modules/log-analysis/index.html

	开始进行数据分析

0. 进入**数据**选项卡

	点击**数据源**旁边的**选择文件**，选择 data.txt

	然后点击**添加数据源** ， 可以见到列表中添加了一个数据源卡片

	点击**显示列表**可以看到当前数据表格。**index**为行序号，**value**为每行数据的值

0. 在过滤器栏输入过滤器名称:`测试`，点击**添加过滤器**

	可以看到列表中有一个名称为`测试`的过滤器卡片被添加

0. 点击过滤器卡片的**显示配置**，点击**添加入口数据**

	在**变量名**位置填写：`data`
	
	在**选择数据**位置填写数据源名称：`C:\fakepath\data.txt`
	
	不同操作系统数据源名称可能不一样，以数据源卡片上的名称为准
	
	点击**刷新**，可以看到数据表格与数据源卡片一样

0. 打开当前页面的**chrome**浏览器控制台

	控制台切换到**console**界面
	
	点击过滤器卡片上的**输出到控制台**
	
	可以看到控制台提示: `数据输出为window.data`
	
	在**浏览器控制台console面板**输入`data`并回车
	
	可以看到**控制台**打印了当前入口数据为一个js数组：

	```js
	["1", "2", "3"]
	```

0. 在过滤器卡片的**请填写数据过滤代码**位置填写过滤器代码：

	```js
	return data.map(function(item){
		return {
			name: 'value',
			value: item * 2
		};
	});
	```
	点击过滤器卡片的**刷新**按钮，可以看到数据表格的更新
	
	表格多出了`name`列
	
	每个过滤器都应该输出JSON数组`[{},{},{}...]`
	
	以便后续组合分析


0. 在顶部导航切换到**视图**选项卡

	在**图表**栏填写图表名称`示例`
	
	点击**添加图表**添加图表卡片

0. 在图表卡片点击**显示配置**
	
	点击**添加入口数据**，在**变量名**位置输入`data`
	
	在**选择数据**位置输入过滤器名称`测试`
	
	点击**刷新**, 可以看到数据表格显示到上面

0. 在**选择图表类型**下拉框选择`echarts/bar`类型

	点击**刷新**，可以看到界面显示了柱状图

0. 在顶部导航切换到**控制**选项卡

	在**导出配置文件**右边点击**保存**按钮
	
	一个json文件会被下载下来

0. 把这个json文件复制到项目目录

	在项目目录配置gruntfile.js:

	```js
	var $path = require('path');

	module.exports = function(grunt) {
		grunt.initConfig({
			logAnalysis : {
				demo : {
					src : 'index.json'
				}
			}
		});

		grunt.loadNpmTasks('log-analysis');

		grunt.registerTask(
			'default',
			'the default task',
			[
				'logAnalysis'
			]
		);

	};
	```

0. 在项目目录执行 `grunt`

	报告文件声称到了项目目录下的 index.html

##Tips

- 可以添加多个数据源
- 过滤器的输入可以是其他过滤器的输出，将入口数据填写为其他过滤器的名称即可
- 过滤器的入口数据变量名，为过滤器代码可以操作的变量名
- 各个过滤器代码之间不会有全局变量污染
- 黄色的过滤器表示正在进行计算
- 绿色的过滤器表示已经计算完成
- 红色的过滤器表示程序出现报错
- 视图图表使用 echarts 渲染
- 图表类型选择为 echarts/custom ，可以在数据过滤代码直接返回 echarts 配置项来自由生成 echarts 支持的图表
- js 处理能力有限，网页导入图表最好不要超过30000条数据，大的数据在生成配置文件后，交给node(grunt 任务)处理
- node 数据处理目前未做流式处理优化，因此数据量过大（超过400000条）可能会导致内存溢出
- 页面数据被存放到了 indexDB, 过滤器代码被存放到了localStorage，刷新页面数据与配置项不会丢失

## Release History

 * 2016-12-03 v0.1.0 正式版发布





 




