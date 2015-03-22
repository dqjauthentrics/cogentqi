'use strict';

angular.module('app.utility', []).factory('Utility', [
	function () {
		return {
			empty: function (v) {
				return v == null || v == undefined || v.length == 0;
			},
			randomIntBetween: function (min, max) {
				return Math.floor(Math.random() * (max - min + 1) + min);
			},
			isDnDsSupported: function () {
				return 'ondrag' in document.createElement("a");
			},
			zeroPad: function (number, size) {
				number = number.toString();
				while (number.length < size) {
					number = "0" + number;
				}
				return number;
			}
		}
	}
])
;