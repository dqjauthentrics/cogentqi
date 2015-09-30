'use strict';

angular.module('Routing', ['ionic']).config(function ($stateProvider, $urlRouterProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider
		.state('login', {
			url: '/login', templateUrl: 'templates/common/login.html', controller: 'LoginController'
		})

		// Professional
		.state('professional', {url: "/professional", abstract: true, templateUrl: "templates/common/tabs.html"})
		.state('professional.dashboard', {
			url: '/dashboard',
			views: {
				dashboard: {templateUrl: 'templates/professional/dashboard.html', controller: 'ProfDashboardCtrl'}
			}
		})

		// Manager
		.state('manager', {url: "/manager", abstract: true, templateUrl: "templates/common/tabs.html"})
		.state('manager.dashboard', {
			url: '/dashboard',
			views: {
				dashboard: {
					templateUrl: 'templates/manager/dashboard.html', controller: 'DashboardCtrl'
				}
			}
		})
		.state('manager.settings', {
			url: '/settings',
			views: {
				settings: {
					templateUrl: 'templates/settings/personal.html', controller: 'SettingsPersonalCtrl'
				}
			}
		})

		// Administrator
		.state('administrator', {url: "/administrator", templateUrl: "templates/common/tabs.html", controller: "AdminTabsCtrl"})
		.state('administrator.dashboard', {
			url: '/dashboard',
			views: {
				dashboard: {templateUrl: 'templates/administrator/dashboard.html', controller: 'AdminDashboardCtrl'}
			}
		})
		.state('administrator.schedule', {
			url: '/schedule',
			views: {
				settings: {templateUrl: 'templates/administrator/schedule.html', controller: 'AdminScheduleCtrl'}
			}
		})
		.state('administrator.planning', {
			url: '/planning',
			views: {
				settings: {templateUrl: 'templates/manager/planning.html', controller: 'PlanningCtrl'}
			}
		})
		.state('administrator.progress', {
			url: '/progress',
			views: {
				settings: {templateUrl: 'templates/administrator/progress.html', controller: 'AdminProgressCtrl'}
			}
		})
		.state('administrator.settings', {
			url: '/configuration',
			views: {
				settings: {
					templateUrl: 'templates/administrator/configuration.html', controller: 'SettingsAdminCtrl'
				}
			}
		})

		// Assessments
		.state('assessment', {url: "/assessment", abstract: true, templateUrl: "templates/common/tabs.html"})
		.state('assessment.matrixOrg', {
			url: '/matrix/:organizationId',
			params: {organizationId: {value: null, squash: true}},
			views: {
				assessments: {templateUrl: 'templates/assessment/matrix.html', controller: 'AssessmentMatrixCtrl'}
			}
		})
		.state('assessment.view', {
			url: '/view/:assessmentId',
			views: {
				assessments: {templateUrl: 'templates/assessment/view.html', controller: 'AssessmentViewCtrl'}
			}
		})
		.state('assessment.list', {
			url: '/list',
			views: {
				assessments: {templateUrl: 'templates/assessment/list.html', controller: 'AssessmentListCtrl'}
			}
		})

		// Resources
		.state('resource', {url: "/resource", abstract: true, templateUrl: "templates/common/tabs.html"})
		.state('resource.view', {
			url: '/view/:resourceId',
			views: {
				resources: {templateUrl: 'templates/resource/view.html', controller: 'ResourceCtrl'}
			}
		})
		.state('resource.list', {
			url: '/list',
			views: {
				resources: {templateUrl: 'templates/resource/list.html', controller: 'ResourceCtrl'}
			}
		})
		.state('resource.alignments', {
			url: '/alignments',
			views: {
				settings: {templateUrl: 'templates/resource/alignments.html', controller: 'ResourceAlignmentsCtrl'}
			}
		})
		.state('resource.alignment', {
			url: '/alignment/:resourceId',
			views: {
				settings: {templateUrl: 'templates/resource/alignment.html', controller: 'ResourceAlignmentCtrl'}
			}
		})

		// Members
		.state('member', {url: "/member", abstract: true, templateUrl: "templates/common/tabs.html"})
		.state('member.view', {
			url: '/view/:memberId',
			views: {
				members: {templateUrl: 'templates/member/view.html', controller: 'MemberViewCtrl'}
			}
		})
		.state('member.list', {
			url: '/list',
			views: {
				members: {templateUrl: 'templates/member/list.html', controller: 'MemberListCtrl'}
			}
		})

		// Organizations
		.state('organization', {url: "/organization", abstract: true, templateUrl: "templates/common/tabs.html"})
		.state('organization.view', {
			url: '/view/:organizationId',
			views: {
				organization: {templateUrl: 'templates/organization/list.html', controller: 'OrganizationCtrl'}
			}
		})
		.state('organization.list', {
			url: '/list',
			views: {
				organization: {templateUrl: 'templates/organization/list.html', controller: 'OrganizationCtrl'}
			}
		})

		// Outcomes
		.state('outcome', {url: "/outcome", abstract: true, templateUrl: "templates/common/tabs.html"})
		.state('outcome.view', {
			url: '/view/:outcomeId',
			views: {
				outcomes: {templateUrl: 'templates/outcome/view.html', controller: 'OutcomeViewCtrl'}
			}
		})
		.state('outcome.list', {
			url: '/list',
			views: {
				outcomes: {templateUrl: 'templates/outcome/outcomes.html', controller: 'OutcomeListCtrl'}
			}
		})
		.state('outcome.alignments', {
			url: '/list',
			views: {
				outcomes: {templateUrl: 'templates/outcome/alignments.html', controller: 'OutcomeAlignmentsCtrl'}
			}
		})

		// Instruments
		.state('instrument', {url: "/instrument", abstract: true, templateUrl: "templates/common/tabs.html"})
		.state('instrument.view', {
			url: '/instrument/:instrumentId',
			views: {
				settings: {templateUrl: 'templates/instrument/view.html', controller: 'InstrumentCtrl'}
			}
		})
		.state('instrument.list', {
			url: '/list',
			views: {
				settings: {templateUrl: 'templates/instrument/list.html', controller: 'InstrumentCtrl'}
			}
		})

		// Help
		.state('help', {url: "/help", abstract: true, templateUrl: "templates/common/tabs.html"})
		.state('help.list', {
			url: '/index',
			views: {
				help: {templateUrl: 'templates/help/index.html', controller: 'HelpIndexCtrl'}
			}
		})

		// Settings
		.state('settings', {url: "/settings", abstract: true, templateUrl: "templates/common/tabs.html"})
		.state('settings.personal', {
			url: '/personal',
			views: {
				help: {templateUrl: 'templates/manager/settings.html', controller: 'SettingsPersonalCtrl'}
			}
		})

	;

	//$urlRouterProvider.otherwise('/manager/dashboard');
	$urlRouterProvider.otherwise(function ($injector, $rootScope, $location) {
		var $cookieStore = $injector.get('$cookieStore');
		var user = $cookieStore.get('user');
		if (user !== undefined && user !== null) {
			return user.home;
		}
		else {
			return '/' + $rootScope.roleInfix() + '/dashboard';
		}
	});
});