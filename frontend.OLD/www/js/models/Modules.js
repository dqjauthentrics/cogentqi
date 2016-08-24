/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Modules', []).service('Modules', function ($resource, Utility, Resources) {
	var svc = this;
	svc.list = null;
	svc.current = null;

	svc.retrieve = function () {
		return $resource('/api3/module', {}, {query: {isArray: false, cache: true}});
	};

	svc.filterer = function (resource, filterText) {
		try {
			if (filterText != null && !Utility.empty(resource)) {
				filterText = filterText.toLowerCase();
				return filterText == null ||
					resource.nmb.toLowerCase().indexOf(filterText) >= 0 ||
					resource.n.toLowerCase().indexOf(filterText) >= 0 ||
					resource.sm.toLowerCase().indexOf(filterText) >= 0
					;
			}
		}
		catch (exception) {
			console.log("module filter exception: ", exception);
		}
		return true;
	}

});
