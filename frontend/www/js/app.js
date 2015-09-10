'use strict';

angular.module('app',
	[
		'ionic',
		'angularLoad',
		'highcharts-ng',
		'ngSanitize',
		'pascalprecht.translate',
		/*'ngTouch', */
		'ngCookies',
		'ngAnimate',
		'ngResource',
		'xeditable',
		'vr.directives.slider',
		'youtube-embed',
		'webcam',
		'Roles',
		'Routing',
		'Icons',
		'PDF',
		'Instruments',
		'InstrumentSchedule',
		'Settings',
		'Plans',
		'Utility',
		'Authentication',
		'Quizzes',
		'Organizations',
		'Members',
		'MemberNotes',
		'Assessments',
		'Resources',
		'LearningModules',
		'Outcomes',
		'ControllerCommon',
		'ControllerManager',
		'ControllerAdministrator',
		'ControllerProfessional'
	]
)
	.config([
		'$httpProvider', function ($httpProvider) {
			$httpProvider.defaults.useXDomain = true;
			delete $httpProvider.defaults.headers.common['X-Requested-With'];
		}
	])

	.config([
		'$translateProvider', function ($translateProvider) {
			var subdomain = 'nursing';
			$translateProvider.useStaticFilesLoader({
				prefix: '/site/' + subdomain + '/translations/locale-',
				suffix: '.json'
			});
			$translateProvider.useSanitizeValueStrategy('sanitize');
			$translateProvider.preferredLanguage('en_US');
		}
	])

	.run(function ($ionicPlatform, $ionicPopup, $rootScope, $location, $window, $cookieStore,
				   editableOptions, angularLoad, Icons, Utility, Roles,
				   Authentication) {
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

				 /** Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
				  */
				 if (window.cordova && window.cordova.plugins.Keyboard) {
					 cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				 }
				 if (window.StatusBar) {
					 // org.apache.cordova.statusbar required
					 StatusBar.styleDefault();
				 }
				 Utility.getResource(Roles.retrieve(), function (response) {
					 $rootScope.roles = response;
				 });

				 angularLoad.loadCSS('/site/' + subdomain + '/theme.css').then(function () {
				 }).catch(function () {
				 });
				 angularLoad.loadScript('site/' + subdomain + '/installation.js').then(function () {
					 $rootScope.installation = installation;
					 $rootScope.installation.subdomain = subdomain;
					 $rootScope.installation.operationalMode = operationalMode;
				 }).catch(function () {
				 });

				 $rootScope.siteDir = function () {
					 if (!Utility.empty($rootScope.installation) && !Utility.empty($rootScope.installation.subdomain)) {
						 return "/site/" + $rootScope.installation.subdomain;
					 }
					 return '/site/nursing'; //@todo fallback
				 };
				 $rootScope.avatarUrl = function (memberId) {
					 if (!Utility.empty($rootScope.installation) && !Utility.empty($rootScope.installation.subdomain) && !Utility.empty(memberId)) {
						 return "/site/" + $rootScope.installation.subdomain + "/avatars/" + memberId + ".jpg";
					 }
					 return '';
				 };
				 $rootScope.avatarAlt = function (member) {
					 if (!Utility.empty(member)) {

						 if (!Utility.empty(member.fn)) {
							 return member.fn + ' ' + member.ln;
						 }
						 else {
							 return member.firstName + ' ' + member.lastName;
						 }
					 }
					 return '';
				 };
				 $rootScope.checkSession = function () {
					 Authentication.check();
				 };
				 $rootScope.logout = function () {
					 var confirmPopup = $ionicPopup.confirm({title: 'Logout Confirmation', template: 'Are you sure you want to log out of the application?'});
					 confirmPopup.then(function (res) {
						 if (res) {
							 Authentication.logout();
							 window.location.href = "/#/login";
							 return 'logged out';
						 }
					 });
					 return '';
				 };
				 $rootScope.dashboardUrl = function () {
					 return Authentication.getUserDashUrl($cookieStore.get('user'));
				 };

				 $rootScope.checkSession();

				 var deviceInformation = ionic.Platform.device();

				 $rootScope.isWebView = ionic.Platform.isWebView();
				 $rootScope.isIPad = ionic.Platform.isIPad();
				 $rootScope.isIOS = ionic.Platform.isIOS();
				 $rootScope.isAndroid = ionic.Platform.isAndroid();
				 $rootScope.isWindowsPhone = ionic.Platform.isWindowsPhone();

				 $rootScope.currentPlatform = ionic.Platform.platform();
				 $rootScope.currentPlatformVersion = ionic.Platform.version();

				 editableOptions.theme = 'bs3';
			 });
		 })
;
