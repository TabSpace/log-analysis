/**
 * @fileoverview 单页数据
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/model/page',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $tip = require('mods/dialog/tip');

	var Page = $model.extend({
		defaults : {
			page : 0,
			totalCount : null,
			totalPage : null,

			first : null,
			prev : null,
			next : null,
			last : null,
			around : null,

			pageEnable : false,
			firstEnable : false,
			lastEnable : false,
			prevEnable : false,
			nextEnable : false,
			aroundEnable : false,

			aroundCount : 9,
			pageSize : 10,
			list : null,
			data : null
		},
		events : {
			'change:data' : 'refresh',
			'change:pageSize' : 'refresh',
			'change:page' : 'compute'
		},
		build : function(){
			this.refresh();
		},
		refresh : function(){
			this.set('page', 1);
			this.compute();
		},
		compute : function(){
			var page = this.get('page');
			var data = this.get('data');
			if(!data){return;}
			if($.type(page) !== 'number'){
				page = parseInt(page, 10) || 0;
				this.set('page', page);
				return;
			}
			if(page <= 0){
				this.set('page', 1);
				return;
			}

			
			var pageSize = this.get('pageSize');
			var totalCount = data.length;
			var totalPage = Math.ceil(totalCount / pageSize);
			var aroundCount = this.get('aroundCount');
			var index = 0;

			var prev = null;
			var next = null;
			var first = null;
			var last = null;
			var around = null;
			var list = null;

			var pageEnable = false;
			var firstEnable = false;
			var lastEnable = false;
			var prevEnable = false;
			var nextEnable = false;
			var aroundEnable = false;

			if(totalPage > 0){
				if(page > totalPage){
					this.set('page', totalPage);
					return;
				}

				//到了这一步，已确保page为1到totalPage之间的整数
				prev = page <= 1 ? null : page - 1;
				next = page >= totalPage ? null : page + 1;
				first = 1;
				last = totalPage;
				list = data.slice( (page - 1) * pageSize, page * pageSize );

				pageEnable = true;
				prevEnable = prev !== null;
				nextEnable = next !== null;
				firstEnable = first !== 1;
				lastEnable = last !== totalPage;

				around = [];
				var target = page;
				var pagePrev = [];
				var pageNext = [];
				for(index = 0; index < aroundCount && index < totalPage; index ++){
					if(page - index - 1 >= 1){
						pagePrev.push(page - index - 1);
					}
					if(page + index + 1 <= totalPage){
						pageNext.push(page + index + 1);
					}
					if(around.length <= 0){
						around.push({page : target, type : 'current'});
					}else{
						if(index % 2 === 0){
							target = pagePrev.pop() || pageNext.pop();
						}else{
							target = pageNext.pop() || pagePrev.pop();
						}
						if(target){
							around.push({page : target});
						}
					}
				}

				if(around[0] && around[0].page > 1){
					if(around[0].page > 2){
						around.unshift({page : '...', type : 'split'});
					}
					around.unshift({page : 1, type : 'first'});
				}

				if(around[around.length - 1] && around[around.length - 1].page < totalPage){
					if(around[around.length - 1].page < totalPage - 1){
						around.push({page : '...', type : 'split'});
					}
					around.push({page : totalPage, type : 'last'});
				}

				aroundEnable = around.length > 1;
			}

			this.set({
				totalCount : totalCount,
				totalPage : totalPage,

				prev : prev,
				next : next,
				first : first,
				last : last,
				around : around,
				list : list,

				pageEnable : pageEnable,
				firstEnable : firstEnable,
				lastEnable : lastEnable,
				prevEnable : prevEnable,
				nextEnable : nextEnable,
				aroundEnable : aroundEnable
			});
		}
	});

	module.exports = Page;

});

