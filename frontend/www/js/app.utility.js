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
			},
			findObjectById: function (objects, id) {
				if (!this.empty(objects) && !this.empty(id)) {
					var idTest = parseInt(id);
					for (var i = 0; i < objects.length; i++) {
						if (parseInt(objects[i].id) == idTest) {
							return objects[i];
						}
					}
				}
				return null;
			},
			getId: function (obj) {
				var key = null;
				if (!this.empty(obj)) {
					for (key in obj) {
						break;
					}
				}
				return key;
			},
			getResource: function (result, successFn) {
				try {
					if (result) {
						result.query(successFn);
					}
				}
				catch (exception) {
					console.log("EXCEPTION(getResource):", exception);
				}
			},

			round: function (value, exp) {
				if (typeof exp === 'undefined' || +exp === 0) {
					return Math.round(value);
				}
				value = +value;
				exp = +exp;
				if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
					return NaN;
				}
				// Shift
				value = value.toString().split('e');
				value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));
				// Shift back
				value = value.toString().split('e');
				return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
			}
		}
	}
]);