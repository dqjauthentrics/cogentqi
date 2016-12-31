import {Injectable} from "@angular/core";
import {Color} from "./color";

@Injectable()
export class Graph {
    public levelColors;
    public regularColors;

    constructor(public color: Color) {
        this.levelColors = ['gray', '#BB4444', '#EE7A00', '#68A', '#6A8'];
        this.regularColors = [
            this.color.pastelify("#0072B2"),
            this.color.pastelify("#009E73"),
            this.color.pastelify("#D55E00"),
            this.color.pastelify("#CC79A7"),
            this.color.pastelify("#F0E442"),
            this.color.pastelify("#FF5733"),
            this.color.pastelify("#5B2C6F"),
            this.color.pastelify("#AF601A"),
            this.color.pastelify("#2C3E50"),
            this.color.pastelify("#5DADEF"),
            this.color.pastelify("#D35400"),
            this.color.pastelify("#196F3D"),
            this.color.pastelify("#9B59B6"),
            this.color.pastelify("#641E16"),
        ];
    }

    public setColor(idx, colorSet) {
        let len = colorSet.length;
        if (idx > len - 1) {
            idx = len % idx;
        }
        if (idx < 0) {
            idx = 0;
        }
        return colorSet[idx];
    }

    public pieGraphConfig(title, subTitle, series, useLevelColors) {
        return {
            chart: {type: 'pie', backgroundColor: 'transparent'},
            title: {text: title, style: {textTransform: 'none'}},
            subtitle: {text: subTitle, style: {textTransform: 'none'}},
            credits: {enabled: false},
            legend: {enabled: false},
            colors: this.regularColors,
            tooltip: {
                formatter: function () {
                    return '<div style="float:left; font-weight:bold;">' +
                        this.point.name + '</div>: ' + this.percentage.toFixed(2) +
                        '% (' + this.point.y + ')';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    }
                }
            },
            series: series
        };
    }

    public columnGraphConfig(title, subTitle, xTitle, yTitle, maxY, xLabels, series) {
        return {
            chart: {type: 'column'},
            credits: {enabled: false},
            title: {text: title},
            subtitle: {text: subTitle},
            xAxis: {
                categories: xLabels,
                crosshair: true,
                labels: {
                    formatter: function () {
                        let text = this.value;
                        let formatted = text.length > 23 ? text.substring(0, 20) + '...' : text;
                        return formatted;
                    }
                }
            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                max: maxY,
                title: {
                    text: yTitle
                }
            },
            colors: this.regularColors,
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">S{series.name}: </td>' +
                '<td style="padding:0"><b>{point.label}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            series: series
        }
    }

    public lineGraphConfig(title, subTitle, xTitle, yTitle, data, useLevelColors) {
        let massagedData = data;
        if (data != undefined) {
            for (let z = 0; z < massagedData.length; z++) {
                if (useLevelColors) {
                    let clrIdx = Math.round(massagedData[z].y);
                    massagedData[z].color = this.setColor(clrIdx, this.levelColors);
                }
                else {
                    massagedData[z].color = this.setColor(z, this.regularColors);
                }
            }
        }
        return {
            options: {
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
                legend: {enabled: false}
            },
            series: [
                {
                    name: yTitle,
                    showInLegend: false,
                    type: 'line',
                    point: {
                        events: {
                            click: function (e) {
                                if (this.options.url) {
                                    let idx = this.options.idx;
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
    }
}