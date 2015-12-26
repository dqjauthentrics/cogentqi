/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Utility', []).factory('Utility', [
	"$ionicPopup",
	function ($ionicPopup) {
		return {
			empty: function (v) {
				return v == null || v == undefined || v.length == 0;
			},
			popup: function (title, message) {
				return $ionicPopup.alert({title: '<i class="fa fa-info-circle fa-lg 2x"></i> ' + title, template: message});
			},
			statusAlert: function (response) {
				if (response.status == 1 && response.code == 200) {
					return $ionicPopup.alert(
						{
							title: '<i class="fa fa-thumbs-up fa-lg 2x"></i> Updated',
							template: response.message ? response.message : 'Action completed.',
							cssClass: 'popSuccess'
						});
				}
				else {
					var msgAppend = response.message ? '<br/><br/><div style="color:#777;">(' + response.message + ')</div>' : '';
					return $ionicPopup.alert(
						{
							title: '<i class="fa fa-warning fa-lg 2x"></i> Problem',
							template: 'Sorry, but there was a problem completing your request. ' + msgAppend,
							cssClass: 'popError'
						});
				}
			},
			confirm: function (title, prompt, callback) {
				var confirmPopup = $ionicPopup.confirm({
														   title: '<i class="fa fa-exclamation-triangle fa-lg 2x"></i> ' + title,
														   template: prompt, cssClass: 'popWarning'
													   });
				confirmPopup.then(function (res) {
					if (res) {
						callback();
					}
				});
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
						return result.query(successFn).$promise;
					}
				}
				catch (exception) {
					console.log("EXCEPTION(getResource):", exception);
                    return $q.reject(exception);
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
			},
			arrayRandom: function (items) {
				return items[Math.floor(Math.random() * items.length)];
			},
			exists: function (url, yesFn, noFn) {
				try {
					$.ajax({
							   type: 'GET',
							   url: '/api3/index/exists/' + encodeURI(url),
							   success: function (data) {
								   if (data == 1) {
									   yesFn();
								   }
								   else {
									   noFn();
								   }
							   },
							   error: function () {
								   noFn();
							   }
						   });
				}
				catch (exception) {
					noFn();
				}
			}
		}
	}
]);