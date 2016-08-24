/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Camera', []).factory('Camera', [
	'$q', function ($q) {
		return {
			getPicture: function (options) {
				var q = $q.defer();

				navigator.camera.getPicture(function (result) {
					// Do any magic you need
					q.resolve(result);
				}, function (err) {
					q.reject(err);
				}, options);

				return q.promise;
			}
		}
	}
]);
