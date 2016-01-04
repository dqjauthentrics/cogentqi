/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('HelpControllers', [])

	.controller(
		'HelpCtrl',
		function ($rootScope, $scope, $stateParams, Utility) {
			$scope.data = {
				searchFilter: '',
				location: '',
				title: '',
				items: [
					{
						id: 0,
						title: 'Getting Started',
						template: 'gettingStarted',
						teaser: 'A step-by-step guide on using this application.'
					},
					{
						id: 1,
						title: 'Getting the Most Out of Professional Development',
						template: 'gettingTheMostOutOfPD',
						teaser: 'How to use this application to get the most out of professional development, for you and your organization.'
					},
					{
						id: 2,
						title: 'Additional Resources',
						template: 'additionalResources',
						teaser: 'Resources available outside this application that can help with professional development.'
					}
				]
			};

			if (!Utility.empty($stateParams.helpId)) {
				var item = $scope.data.items[$stateParams.helpId];
				$scope.data.title = item.title;
				var location = $rootScope.siteDir() + '/help/' + item.template + '.html';
				Utility.exists(location,
							   function () {
								   $scope.data.location = location;
							   },
							   function () {
								   $scope.data.location = 'site/default/help/' + item.template + '.html';
							   });
			}
		})
;
