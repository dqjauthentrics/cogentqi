'use strict';

angular.module('app.graphs', []).service('Graphs', function () {
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
	this.columnGraphConfig = function (title, subTitle, xTitle, yTitle, maxY, xLabels, series) {
		return {
			chart: {
				type: 'column'
			},
			title: {
				text: title
			},
			subtitle: {
				text: subTitle
			},
			xAxis: {
				categories: xLabels,
				crosshair: true
			},
			yAxis: {
				min: 0,
				max: maxY,
				title: {
					text: yTitle
				}
			},
			tooltip: {
				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				'<td style="padding:0"><b>{point.label}</b></td></tr>',
				footerFormat: '</table>',
				shared: true,
				useHTML: true
			},
			plotOptions: {
				column: {
					pointPadding: 0.2,
					borderWidth: 0
				}
			},
			series: series
		}
	};
	this.lineGraphConfig = function (title, subTitle, xTitle, yTitle, data, useLevelColors) {
		var massagedData = data;
		if (data != undefined) {
			for (var z = 0; z < massagedData.length; z++) {
				if (useLevelColors) {
					var clrIdx = Math.round(massagedData[z].y);
					massagedData[z].color = this.setColor(clrIdx, this.levelColors);
				}
				else {
					massagedData[z].color = this.setColor(z, this.regularColors);
				}
			}
		}
		return {
			chart: {type: 'line', backgroundColor: '#FFFFFF'},
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
					type: 'line',
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

