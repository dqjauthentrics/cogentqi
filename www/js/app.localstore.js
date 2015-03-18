'use strict';

angular.module('app.utility', []).factory('LocalStore', [
	'$window', function ($window) {
		return {
			set: function (key, value) {
				$window.localStorage[key] = value;
				return $window.localStorage[key];
			},
			get: function (key, defaultValue) {
				return $window.localStorage[key] || defaultValue;
			},
			setObject: function (key, value) {
				$window.localStorage[key] = JSON.stringify(value);
			},
			getObject: function (key) {
				try {
					return JSON.parse($window.localStorage[key] || '{}');
				}
				catch (exception) {
					$window.localStorage.removeItem(key);
				}
			},
			removeObject: function (key) {
				$window.localStorage.removeItem(key);
			},
			storeCallback: function (error) {
				if (error) {
					console.log('ERROR: Synchronization failed');
				}
				else {
					console.log('Synchronization succeeded');
				}
			}
		}
	}
])