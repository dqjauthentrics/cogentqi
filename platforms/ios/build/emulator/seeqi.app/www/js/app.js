// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in EmployeeService.js
// 'starter.controllers' is found in controllers.js
angular.module('app',
			   [
				   'ionic',
				   'app.icons',
				   'app.employees',
				   'app.assessments',
				   'app.resources',
				   'app.classes',
				   'app.controllers',
				   'app.outcomes',
				   'ngSanitize',
				   'ngTouch',
				   'ngAnimate',
				   'vr.directives.slider',
				   'youtube-embed'
			   ]
)
	.run(function ($ionicPlatform, $rootScope, Icons) {
			 $ionicPlatform.ready(function () {

				 $rootScope.installation = {name: 'Target PHARMACY'};
				 $rootScope.i = Icons;

				 // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				 // for form inputs)
				 if (window.cordova && window.cordova.plugins.Keyboard) {
					 cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				 }
				 if (window.StatusBar) {
					 // org.apache.cordova.statusbar required
					 StatusBar.styleDefault();
				 }
			 });
		 })
	.directive('levelTag', function () {
				   return {
					   restrict: 'E',
					   templateUrl: 'templates/_levelTag.html',
					   scope: {text: '=', level: '=', icon: '='}
				   };
			   })
	.directive('microBadge', function () {
				   return {
					   restrict: 'E',
					   templateUrl: 'templates/_microBadge.html',
					   scope: {text: '=', size: '='}
				   };
			   })
	.directive('recommendationRanking', function () {
				   return {
					   restrict: 'E',
					   templateUrl: 'templates/_recommendationRanking.html',
					   scope: {weight: '=', range: '='}
				   };
			   })
	.filter('currentDateTime', [
				'$filter', function ($filter) {
					return function () {
						return $filter('date')(new Date(), 'medium');
					};
				}
			])
	.config(function ($stateProvider, $urlRouterProvider) {

				// Ionic uses AngularUI Router which uses the concept of states
				// Learn more here: https://github.com/angular-ui/ui-router
				// Set up the various states which the app can be in.
				// Each state's controller can be found in controllers.js
				$stateProvider

					// setup an abstract state for the tabs directive
					.state('tab', {
							   url: "/tab",
							   abstract: true,
							   templateUrl: "templates/tabs.html"
						   })

					// Each tab has its own nav history stack:

					.state('tab.dashboard', {
							   url: '/dashboard',
							   views: {
								   'tabDashboard': {
									   templateUrl: 'templates/dashboard.html', controller: 'DashboardCtrl'
								   }
							   }
						   })

					.state('tab.outcomes', {
							   url: '/outcomes',
							   views: {
								   'tabOutcomes': {
									   templateUrl: 'templates/outcomes.html',
									   controller: 'OutcomeCtrl'
								   }
							   }
						   })
					.state('tab.employees', {
							   url: '/employees',
							   views: {
								   'tabEmployees': {
									   templateUrl: 'templates/employees.html',
									   controller: 'EmployeeCtrl'
								   }
							   }
						   })
					.state('tab.employee', {
							   url: '/employees/:employeeId',
							   views: {
								   'tabEmployees': {
									   templateUrl: 'templates/employee.html',
									   controller: 'EmployeeDetailCtrl'
								   }
							   }
						   })

					.state('tab.assessments', {
							   url: '/assessments',
							   views: {
								   'tabAssessments': {
									   templateUrl: 'templates/assessments.html',
									   controller: 'AssessmentCtrl'
								   }
							   }
						   })
					.state('tab.assessment', {
							   url: '/assessment/:assessmentId/:employeeId',
							   views: {
								   'tabAssessments': {
									   templateUrl: 'templates/assessment.html',
									   controller: 'AssessmentCtrl'
								   }
							   }
						   })
					.state('tab.assessmentMatrix', {
							   url: '/assessments/matrix',
							   views: {
								   'tabAssessments': {
									   templateUrl: 'templates/assessmentMatrix.html',
									   controller: 'AssessmentCtrl'
								   }
							   }
						   })
					.state('tab.classes', {
							   url: '/classes',
							   views: {
								   'tabResources': {
									   templateUrl: 'templates/classes.html',
									   controller: 'ClassCtrl'
								   }
							   }
						   })
					.state('tab.resources', {
							   url: '/resources',
							   views: {
								   'tabResources': {
									   templateUrl: 'templates/resources.html',
									   controller: 'ResourceCtrl'
								   }
							   }
						   })
					.state('tab.resourceDetail', {
							   url: '/resource/:resourceId',
							   views: {
								   'tabResources': {
									   templateUrl: 'templates/resource.html',
									   controller: 'ResourceCtrl'
								   }
							   }
						   })
					.state('tab.assessmentEmpSection', {
							   url: '/assessment/:assessmentId/:employeeId/:sectionIdx',
							   views: {
								   'tabAssessments': {
									   templateUrl: 'templates/assessment.html',
									   controller: 'AssessmentCtrl'
								   }
							   }
						   })
					.state('tab.latestAssessment', {
							   url: '/assessment/:employeeId',
							   views: {
								   'tabAssessments': {
									   templateUrl: 'templates/assessment.html',
									   controller: 'AssessmentCtrl'
								   }
							   }
						   })
					.state('tab.settings', {
							   url: '/settings',
							   views: {
								   'tabSettings': {
									   templateUrl: 'templates/settings.html',
									   controller: 'SettingsCtrl'
								   }
							   }
						   });

				// if none of the above states are matched, use this as the fallback
				$urlRouterProvider.otherwise('/tab/dashboard');

			});
