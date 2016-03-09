/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module(
	'app',
	[
		'ionic',
		'angularLoad',
		'highcharts-ng',
		'ngSanitize',
		'ngIdle',
		'pascalprecht.translate',
		/*'ngTouch', */
		/*'textAngular',*/
		'clear-input',
		'ngCookies',
		'ngAnimate',
		'ngResource',
		'ui.calendar',
		'ui.bootstrap',
		'xeditable',
		'vr.directives.slider',
		'angular-redactor',
		'rzModule',
		'youtube-embed',
		'webcam',
		'Roles',
		'Routing',
		'Icons',
		'Messages',
		'PDF',
		'Configuration',
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
		'QuestionGroups',
		'Events',
		'EventAlignments',
		'ResourceAnalysis',
		'ResourceEfficacy',
		'Modules',
		'Outcomes',
		'ControllerCommon',
		'MemberControllers',
		'ReportsControllers',
		'OrganizationControllers',
		'InstrumentControllers',
		'SettingsControllers',
		'OutcomeControllers',
		'EventControllers',
		'AssessmentControllers',
		'HelpControllers',
		'ModuleControllers',
		'ResourceControllers',
		'ControllerManager',
		'ControllerAdministrator',
		'ControllerProfessional'
	])

	.config(
		[
			'$httpProvider',
			function ($httpProvider) {
				$httpProvider.defaults.useXDomain = true;
				delete $httpProvider.defaults.headers.common['X-Requested-With'];
			}
		])

	.config(
		[
			'$translateProvider',
			function ($translateProvider) {
				var subdomain = 'default';
				try {
					var parts = window.location.host.split('.');
					if (parts.length >= 2 && parts[0]) {
						subdomain = parts[0];
					}
				}
				catch (exception) {
					console.log(exception);
				}
				$translateProvider.useStaticFilesLoader({prefix: '/site/' + subdomain + '/translations/locale-', suffix: '.json'});
				$translateProvider.useSanitizeValueStrategy('sanitize');
				$translateProvider.preferredLanguage('en_US');
			}
		])

	.constant("APP_ROLES", {
		"PROFESSIONAL": "professional",
		"MANAGER": "manager",
		"ADMINISTRATOR": "administrator",
		"CH_PROFESSIONAL": "P",
		"CH_MANAGER": "M",
		"CH_ADMINISTRATOR": "A"
	})
	.config(function (IdleProvider) {
		IdleProvider.idle(10 * 60); // 10 minutes idle
		IdleProvider.timeout(30); // 30 second warning
	})

	.run(function ($ionicPlatform, $ionicPopup, $rootScope, $location, $window, $cookieStore,
				   editableOptions, angularLoad, Icons, Utility, Roles, APP_ROLES,
				   $filter, Authentication) {
		$ionicPlatform.ready(function () {

			$rootScope.i = Icons;
			$rootScope.APP_ROLES = APP_ROLES;
			$rootScope.dirty = false;

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

			$rootScope.$on('$idleTimeout', function () {
				// end their session and redirect to login
				//alert('timeout');
			});

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
				$rootScope.roles = response.data;
			});

			angularLoad.loadCSS('/site/' + subdomain + '/theme.css').then(function () {
			}).catch(function () {
			});
			angularLoad.loadScript('site/' + subdomain + '/config.js').then(function () {
				$rootScope.installation = configuration;
				$rootScope.installation.subdomain = subdomain;
				$rootScope.installation.operationalMode = operationalMode;
			}).catch(function () {
			});

			$rootScope.siteDir = function () {
				if (!Utility.empty($rootScope.installation) && !Utility.empty($rootScope.installation.subdomain)) {
					return "/site/" + $rootScope.installation.subdomain;
				}
				return '/site/healthcare'; //@todo fallback
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
			$rootScope.goTo = function (url) {
				$window.location.href = url;
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

			$rootScope.roleInfix = function () {
				var infix = APP_ROLES.PROFESSIONAL;
				var user = $cookieStore.get('user');
				if (user !== undefined && user !== null) {
					switch (user.ari) {
						case 'A':
							infix = APP_ROLES.ADMINISTRATOR;
							break;
						case'M':
							infix = APP_ROLES.MANAGER;
							break;
					}
				}
				return infix;
			};
			$rootScope.userRoleChar = function () {
				var user = $cookieStore.get('user');
				if (user !== undefined && user !== null) {
					return user.ari;
				}
				return null;
			};
			$rootScope.isAdministrator = function () {
				return $rootScope.userRoleChar() == APP_ROLES.CH_ADMINISTRATOR;
			};
			$rootScope.isManager = function () {
				return $rootScope.userRoleChar() == APP_ROLES.CH_MANAGER;
			};
			$rootScope.isProfessional = function () {
				var isP = $rootScope.userRoleChar() == APP_ROLES.CH_PROFESSIONAL;
			};
			$rootScope.roleIs = function (roleNames) {
				return $.inArray($rootScope.roleInfix(), roleNames) >= 0;
			};

			$rootScope.roleView = function (urlPortion) {
				var infix = $rootScope.roleInfix();
				var url = '#/' + infix + '/' + urlPortion;
				return url;
			};
			$rootScope.setDirty = function () {
				$rootScope.dirty = true;
			};
			$rootScope.isDirty = function () {
				return $rootScope.dirty;
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
