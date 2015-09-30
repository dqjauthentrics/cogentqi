'use strict';

angular.module('Utility', []).factory('Utility', [
	"$ionicPopup",
	function ($ionicPopup) {
		return {
			popup: function (title, message) {
				$ionicPopup.alert({title: title, template: message});
			},
			statusAlert: function (status, data) {
				if (status) {
					$ionicPopup.alert({title: 'Updated', template: 'Your changes were saved.'});
				}
				else {
					$ionicPopup.alert({title: 'Problem', template: 'Sorry, but there was a problem saving your changes.'});
				}
			},
			confirm: function (title, prompt, callback) {
				var confirmPopup = $ionicPopup.confirm({title: title, template: prompt});
				confirmPopup.then(function (res) {
					if (res) {
						callback();
					}
				});
			},
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
			hexToRgb: function (hex) {
				// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
				var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
				hex = hex.replace(shorthandRegex, function (m, r, g, b) {
					return r + r + g + g + b + b;
				});
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : null;
			},
			rgbToHex: function (r, g, b) {
				return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
			},
			ucfirst: function (str) {
				str += '';
				var f = str.charAt(0)
					.toUpperCase();
				return f + str.substr(1);
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