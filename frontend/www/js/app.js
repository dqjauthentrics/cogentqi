'use strict';

angular.module('app',
			   [
				   'ionic',
				   'angularLoad',
				   'highcharts-ng',
				   'ngSanitize',
				   'ngTouch',
				   'ngCookies',
				   'ngAnimate',
				   'ngResource',
				   'vr.directives.slider',
				   'youtube-embed',
				   'app.routes',
				   'app.icons',
				   'app.instruments',
				   'app.settings',
				   'app.utility',
				   'app.authentication',
				   'app.organizations',
				   'app.members',
				   'app.evaluations',
				   'app.resources',
				   'app.learningModules',
				   'app.controllers.common',
				   'app.controllers.manager',
				   'app.controllers.administrator',
				   'app.controllers.professional',
				   'app.outcomes'
			   ]
)
	.config([
				'$httpProvider', function ($httpProvider) {
					$httpProvider.defaults.useXDomain = true;
					delete $httpProvider.defaults.headers.common['X-Requested-With'];
				}
			])
	.run(function ($ionicPlatform, $rootScope, $location, $window, $cookieStore, angularLoad, Icons, Utility, Authentication) {
			 $ionicPlatform.ready(function () {

				 $rootScope.i = Icons;

				 var host = $location.host();
				 var parts = host.split('.');
				 var subdomain = "default";
				 var operationalMode = "Development";
				 if (parts.length >= 2 && parts[0] != "www" && parts[0] != "app") {
					 subdomain = parts[0];
				 }
				 if (parts.length > 1 && parts[(parts.length - 1)] == "com") {
					 operationalMode = "Production";
				 }
				 angularLoad.loadCSS('css/themes/' + subdomain + '.css').then(function () {
				 }).catch(function () {
				 });
				 angularLoad.loadScript('js/config/' + subdomain + '/installation.js').then(function () {
					 $rootScope.installation = installation;
					 $rootScope.installation.subdomain = subdomain;
					 $rootScope.installation.operationalMode = operationalMode;
				 }).catch(function () {
				 });

				 // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				 // for form inputs)
				 if (window.cordova && window.cordova.plugins.Keyboard) {
					 cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				 }
				 if (window.StatusBar) {
					 // org.apache.cordova.statusbar required
					 StatusBar.styleDefault();
				 }

				 $rootScope.checkSession = function () {
					 Authentication.check();
				 };
				 $rootScope.logout = function () {
					 Authentication.logout();
					 window.location.href = "/#/login";
					 return 'logged out';
				 };
				 $rootScope.checkSession();
				 $rootScope.user = $cookieStore.get('user');

				 $rootScope.dashboardUrl = function () {
					 return Authentication.getUserDashUrl($cookieStore.get('user'));
				 };
			 });
		 })
	.value('BASE_URL', '/#/professional/dashboard')

	.directive('headerButtons', function () {
				   return {restrict: 'E', templateUrl: 'templates/_headerButtons.html'};
			   })
	.directive('dashboardCycle', function () {
				   return {
					   restrict: 'E',
					   templateUrl: '../templates/common/dashboardCycle.html',
					   scope: {Members: '=', role: '=', user: '=', jobtitle: '='}
				   };
			   })
	.directive('memberItem', function () {
				   return {
					   restrict: 'E',
					   templateUrl: '../templates/common/memberItem.html',
					   scope: {member: '=', m: '=', i: '='}
				   };
			   })
	.directive('memberProfile', function () {
				   return {
					   restrict: 'E',
					   templateUrl: '../templates/common/memberProfile.html',
					   scope: {member: '=', m: '=', e: '=', i: '='}
				   };
			   })
	.directive('levelTag', function () {
				   return {
					   restrict: 'E',
					   templateUrl: '../templates/common/levelTag.html',
					   scope: {text: '=', level: '=', icon: '='}
				   };
			   })
	.directive('outcomeLevelTag', function () {
				   return {
					   restrict: 'E',
					   templateUrl: '../templates/common/outcomeLevelTag.html',
					   scope: {text: '=', level: '=', icon: '='}
				   };
			   })
	.directive('microBadge', function () {
				   return {
					   restrict: 'E',
					   templateUrl: '../templates/common/microBadge.html',
					   scope: {text: '=', size: '='}
				   };
			   })
	.directive('recommendationRanking', function () {
				   return {
					   restrict: 'E',
					   templateUrl: '../templates/common/recommendationRanking.html',
					   scope: {weight: '=', range: '='}
				   };
			   })
	.filter('currentDateTime', [
				'$filter', function ($filter) {
					return function () {
						return $filter('date')(new Date(), 'medium');
					};
				}
			]);
