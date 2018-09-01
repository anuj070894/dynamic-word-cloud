(function (global, CannyJS) {
	var DynamicWordCloud = function (options) {
		options.highThreshold = options.highThreshold || 100;
		options.lowThreshold = options.lowThreshold || 50;
		options.sigma = options.sigma || 1.4;
		options.kernelSize = options.kernelSize || 3;
		return new DynamicWordCloud.init(options);
	};

	var _canvas,

		ctx,

		canny,

		options,

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
		}
	};

	DynamicWordCloud.init = function (_options) {
		options = _options;
		loadImage(_options);
	};

	DynamicWordCloud.init.prototype = DynamicWordCloud.prototype;

	global.DynamicWordCloud = DynamicWordCloud;
}(window, CannyJS));
