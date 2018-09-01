var dynamicWordCloud = DynamicWordCloud({
	url: 'xd_prototype_analytics.png',
	canvasId: 'canvas'
});

document.getElementById("contours").addEventListener('click', function () {
	dynamicWordCloud.drawContours();
	dynamicWordCloud.invertImage();
	dynamicWordCloud.drawRectangles();
});
