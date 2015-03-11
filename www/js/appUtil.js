'use strict';

angular.module('app.utils', [])
	.factory('$appStore', [
				 '$window', 'FIREBASE_URL', function ($window, FIREBASE_URL) {
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
								 //console.log("getObject exception, key=", key, ", exception=", exception);
							 }
						 },
						 removeObject: function (key) {
							 $window.localStorage.removeItem(key);
						 },
						 storeCallback: function (error) {
							 if (error) {
								 console.log('Synchronization failed');
							 }
							 else {
								 console.log('Synchronization succeeded');
							 }
						 }
					 }
				 }
			 ])
	.factory('$appUtil', [
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
	.factory('$appLog', [
				 '$rootScope', function ($rootScope) {
					 return {
						 store: function (msg) {
							 console.log("LOG:", $rootScope.user.id, msg);
						 }
					 }
				 }
			 ])
;