define('config',function(require,exports,module){

	var config = {
		base:'js/',
		//it will replace the real BASEPATH
		//for debug or update timestamp ? All javascript modules will be used
		alias:{
			'lib':'lib/core/chaos/zepto'
		}
	};

	if(lithe.debug){
		config.timestamp = Date.now();
	}

	module.exports = config;
});

