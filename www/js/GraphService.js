'use strict';

app.service('GraphService', function () {
	this.levelColors = ['gray', '#BB4444', '#EE7A00', '#68A', '#6A8'];
	this.regularColors = ['#577', '#799', '#9BB', '#BDD', '#DFF'];

	this.setColor = function (idx, colorSet) {
		var len = colorSet.length;
		if (idx > len - 1) {
			idx = len % idx;
		}
		if (idx < 0) {
			idx = 0;
		}
		return colorSet[idx];
	};

	this.pieGraphConfig = function (title, subTitle, data, useLevelColors) {
		return {
			chart: {
				backgroundColor: '#FFFFFF'
			},
			title: {text: title, style: {textTransform: 'none'}},
			subtitle: {text: subTitle, style: {textTransform: 'none'}},
			credits: {enabled: false},
			options: {
				tooltip: {
					formatter: function () {
						return '<div style="float:left; font-weight:bold;">' +
							this.point.name + '</div>: ' + this.percentage.toFixed(2) +
							'% (' + this.point.y + ')';
					}
				}
			},
			series: [
				{
					slicedOffset: 0,
					size: '100%',
					type: 'pie',
					colors: (useLevelColors ? this.levelColors : this.regularColors),
					data: data,
					point: {
						events: {
							click: function (e) {
								if (!app.empty(this.options.url)) {
									location.href = e.point.url + '/' + this.options.idx;
									e.preventDefault();
								}
							}
						}
					},
					dataLabels: {
						enabled: true,
						distance: -30,
						color: '#000',
						formatter: function () {
							if (this.y > 0) {
								return this.point.name.replace(" ", '<br>') + '<br/>' + this.percentage.toFixed(1) + '%';
							}
							else {
								return null;
							}
						},
						style: {fontWeight: 'bold', fontSize: '14px'}
					}
				}
			]
		};
	};
	this.columnGraphConfig = function (title, subTitle, xTitle, yTitle, data, useLevelColors) {
		var massagedData = data;
		for (var z = 0; z < massagedData.length; z++) {
			if (useLevelColors) {
				var clrIdx = Math.round(massagedData[z].y);
				massagedData[z].color = this.setColor(clrIdx, this.levelColors);
			}
			else {
				massagedData[z].color = this.setColor(z, this.regularColors);
			}
		}
		return {
			chart: {type: 'column', backgroundColor: '#FFFFFF'},
			title: {text: title, style: {textTransform: 'none'}},
			subtitle: {text: subTitle, style: {textTransform: 'none'}},
			credits: {enabled: false},
			yAxis: {title: {text: yTitle, style: {textTransform: 'none'}}, tickInterval: 1, minorTickInterval: false},
			xAxis: {
				type: 'category',
				title: {text: xTitle, style: {textTransform: 'none'}},
				tickInterval: 1,
				minorTickInterval: false,
				gridLineWidth: 0
			},
			legend: {enabled: false},
			series: [
				{
					name: yTitle,
					showInLegend: false,
					type: 'column',
					point: {
						events: {
							click: function (e) {
								if (!app.empty(this.options.url)) {
									var idx = this.options.idx;
									location.href = e.point.url + '/' + idx;
									e.preventDefault();
								}
							}
						}
					},
					data: massagedData
				}
			]
		}
	};
});

