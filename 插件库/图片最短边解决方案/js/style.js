// Leon @ 2017/4/24

(function($, window, document, undefined) {
	$.fn.bsPictureAlign = function(options) {
		var num = this.length,
			loadnum = 0;
		for (i = 0; i < this.length; i++) {
			var _this = this[i];
			var bsPictureAlign = new BsPictureAlign(_this, options);
			if (options.style == "fullImg") bsPictureAlign.fullImg();
		}
	};
	var BsPictureAlign = function(ele, opt) {
		this.$ele = ele;
		//若无定义宽高背景，使用默认值
			this.defaults = {
				"width": "100%",
				"height": "300px",
				"background": "#000"
			};
			this.options = $.extend({}, this.defaults, opt);
	};
	BsPictureAlign.prototype = {
		fullImg: function() {
			var that = this,
				_options = that.options,
				_ele = $(this.$ele),
				_img = _ele.find("img"),
				_this, _width, _height, _ratio, _w, _h, _r, _wider;
			//修改图片外壳宽高
			_ele.css({
				"width": _options.width,
				"height": _options.height,
				"overflow": "hidden",
				"background": "#000",
				"position": "relative"
			});
			//容器比例
			_width = _ele.width();
			_height = _ele.height();
			_ratio = _width / _height;
			//每张所选图片进行处理
			_img.each(function() {
				_this = $(this);
				//此处确保图片加载完毕
				_this.load(function() {
					_w = _this.width();
					_h = _this.height();
					_r = _w / _h;
					_wider = _r > _ratio ? true : false;
					//容器宽高比大于图片时，图片高度100%，宽度按比例缩放按比例缩放
					if (_wider) {
						_this.css({
							"width": "auto",
							"height": "100%"
						});
						var _left = (_width - _this.width()) / 2;
						_this.css({
							"position": "absolute",
							"top": 0,
							"left": _left + "px"
						});
					//容器宽高比小于图片时，图片宽度100%，高度按比例缩放按比例缩放
					} else {
						_this.css({
							"width": "100%",
							"height": "auto"
						});
						var _top = (_height - _this.height()) / 2;
						_this.css({
							"position": "absolute",
							"top": _top + "px",
							"left": 0
						});
					}
				});
			});
			return this;
		},
	}
})(jQuery, window, document);