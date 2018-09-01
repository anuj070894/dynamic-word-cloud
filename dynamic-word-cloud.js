(function (global, CannyJS) {
	var DynamicWordCloud = function (options) {
		options.highThreshold = options.highThreshold || 100;
		options.lowThreshold = options.lowThreshold || 50;
		options.sigma = options.sigma || 1.4;
		options.kernelSize = options.kernelSize || 3;
		return new DynamicWordCloud.init(options);
	};

	// constants
	var AVG_WHITE = 255,

		AVG_BLACK = 0;

	var _canvas,

		ctx,

		canny,

		options,

		points = [],

		quad,

		loadImage = function (options) {
			var img = new Image();
			img.src = options.url;
			img.onload = function () {
				_canvas = global.document.getElementById(options.canvasId);
				_canvas.width = img.width;
				_canvas.height = img.height;
				ctx = _canvas.getContext('2d');
				ctx.drawImage(img, 0, 0);
			};
		};

	DynamicWordCloud.prototype = {
		drawContours: function () {
			canny = CannyJS.canny(_canvas, options.highThreshold, options.lowThreshold, options.sigma, options.kernelSize);
			canny.drawOn(_canvas);
		},

		invertImage: function () {
			var imageData = ctx.getImageData(0, 0, _canvas.width, _canvas.height);
			var data = imageData.data;
			for (var i = 0; i < data.length; i+=4) {
				data[i] = 255 - data[i];
				data[i + 1] = 255 - data[i + 1];
				data[i + 2] = 255 - data[i + 2];
			}
			ctx.putImageData(imageData, 0, 0);
		},

		drawRectangles: function (noOfReactangles) {
			noOfReactangles = noOfReactangles || ((_canvas.width / 4) * (_canvas.height / 4));
			var pointQuad = true;
			var bounds = {
				x: 0,
				y: 0,
				width: _canvas.width,
				height: _canvas.height
			};
			quad = new QuadTree(bounds, pointQuad);
			var imageData = ctx.getImageData(0, 0, _canvas.width, _canvas.height);
			var data = imageData.data,
				totalPoints = data.length / 4;
			for (var i = 0; i < data.length; i+=4) {
				if (((data[i] + data[i + 1] + data[i + 2]) / 3) === AVG_BLACK) {
					var x = Math.floor(i / 4) % _canvas.width;
					var y = Math.floor((Math.floor(i / 4) - x) / _canvas.width);
					quad.insert({
						x: x,
						y: y
					});
                    // console.log('X: ', x,'Y: ', y);
					// data[(x + y * _canvas.width) * 4] = 255; // useful for debugging
				}
			}
			// console.log(quad.retrieve({x: 179, y: 52}));
			// ctx.putImageData(imageData, 0, 0); // useful for debugging
		}
	};

	DynamicWordCloud.init = function (_options) {
		options = _options;
		loadImage(_options);
	};

	DynamicWordCloud.init.prototype = DynamicWordCloud.prototype;

	global.DynamicWordCloud = DynamicWordCloud;
}(window, CannyJS));
