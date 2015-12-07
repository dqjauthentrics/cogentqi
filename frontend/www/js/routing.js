/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
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
		.state('professional', {url: "/professional", abstract: true, templateUrl: "templates/common/tabs.html", controller: "CommonTabsCtrl"})
		.state('professional.dashboard', {
			url: '/dashboard',
			views: {
				dashboard: {templateUrl: 'templates/professional/dashboard.html', controller: 'ProfDashboardCtrl'}
			}
		})

		// Manager
		.state('manager', {url: "/manager", abstract: true, templateUrl: "templates/common/tabs.html", controller: "CommonTabsCtrl"})
		.state('manager.dashboard', {
			url: '/dashboard',
			views: {
				dashboard: {
					templateUrl: 'templates/manager/dashboard.html', controller: 'DashboardCtrl'
				}
			}
		})

		// Administrator
		.state('administrator', {url: "/administrator", templateUrl: "templates/common/tabs.html", controller: "CommonTabsCtrl"})
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
		.state('administrator.progress', {
			url: '/progress',
			views: {
				settings: {templateUrl: 'templates/administrator/progress.html', controller: 'AdminProgressCtrl'}
			}
		})
		.state('administrator.configuration', {
			url: '/configuration',
			views: {
				settings: {
					templateUrl: 'templates/administrator/configuration.html', controller: 'SettingsAdminCtrl'
				}
			}
		})

		// Assessments
		.state('assessment', {url: "/assessment", abstract: true, templateUrl: "templates/common/tabs.html", controller: "CommonTabsCtrl"})
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
		.state('assessment.new', {
			url: '/new/:memberId/:assessmentId',
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

		// Modules
		.state('module', {url: "/module", abstract: true, templateUrl: "templates/common/tabs.html", controller: "CommonTabsCtrl"})
		.state('module.list', {
			url: '/list',
			views: {
				resources: {templateUrl: 'templates/module/list.html', controller: 'ModuleListCtrl'}
			}
		})

		// Resources
		.state('resource', {url: "/resource", abstract: true, templateUrl: "templates/common/tabs.html", controller: "CommonTabsCtrl"})
		.state('resource.view', {
			url: '/view/:resourceId',
			views: {
				resources: {templateUrl: 'templates/resource/view.html', controller: 'ResourceViewCtrl'}
			}
		})
		.state('resource.list', {
			url: '/list',
			views: {
				resources: {templateUrl: 'templates/resource/list.html', controller: 'ResourceListCtrl'}
			}
		})
		.state('resource.edit', {
			url: '/edit/:resourceId',
			views: {
				settings: {templateUrl: 'templates/resource/edit.html', controller: 'ResourceEditCtrl'}
			}
		})
		.state('resource.configure', {
			url: '/configure',
			views: {
				settings: {templateUrl: 'templates/resource/configList.html', controller: 'ResourceListCtrl'}
			}
		})
		.state('resource.alignment', {
			url: '/alignment/:resourceId',
			views: {
				settings: {templateUrl: 'templates/resource/alignment.html', controller: 'ResourceAlignmentCtrl'}
			}
		})

		// Members
		.state('member', {url: "/member", abstract: true, templateUrl: "templates/common/tabs.html", controller: "CommonTabsCtrl"})
		.state('member.view', {
			url: '/view/:memberId',
			views: {
				members: {templateUrl: 'templates/member/view.html', controller: 'MemberViewCtrl'}
			}
		})
		.state('member.notes', {
			url: '/notes/:memberId',
			views: {
				members: {templateUrl: 'templates/member/notes.html', controller: 'MemberNotesCtrl'}
			}
		})
		.state('member.progress', {
			url: '/progress/:memberId',
			views: {
				members: {templateUrl: 'templates/member/progress.html', controller: 'MemberProgressCtrl'}
			}
		})
		.state('member.barprogress', {
			url: '/barProgress/:memberId',
			views: {
				members: {templateUrl: 'templates/member/barProgress.html', controller: 'MemberBarProgressCtrl'}
			}
		})
		.state('member.list', {
			url: '/list',
			views: {
				members: {templateUrl: 'templates/member/list.html', controller: 'MemberListCtrl'}
			}
		})

		// Organizations
		.state('organization', {url: "/organization", abstract: true, templateUrl: "templates/common/tabs.html", controller: "CommonTabsCtrl"})
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
		.state('outcome', {url: "/outcome", abstract: true, templateUrl: "templates/common/tabs.html", controller: "CommonTabsCtrl"})
		.state('outcome.view', {
			url: '/view/:outcomeId',
			views: {
				outcomes: {templateUrl: 'templates/outcome/view.html', controller: 'OutcomeViewCtrl'}
			}
		})
		.state('outcome.organization', {
			url: '/organization',
			views: {
				outcomes: {templateUrl: 'templates/outcome/organizationOutcomes.html', controller: 'OutcomeOrganizationCtrl'}
			}
		})
		.state('outcome.alignments', {
			url: '/alignments',
			views: {
				settings: {templateUrl: 'templates/outcome/alignments.html', controller: 'OutcomeAlignmentsCtrl'}
			}
		})
		.state('outcome.alignment', {
			url: '/alignment/:outcomeId',
			views: {
				settings: {templateUrl: 'templates/outcome/alignment.html', controller: 'OutcomeAlignmentCtrl'}
			}
		})

		// Instruments
		.state('instrument', {url: "/instrument", abstract: true, templateUrl: "templates/common/tabs.html", controller: "CommonTabsCtrl"})
		.state('instrument.view', {
			url: '/view/:instrumentId',
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
		.state('help', {url: "/help", abstract: true, templateUrl: "templates/common/tabs.html", controller: "CommonTabsCtrl"})
		.state('help.list', {
			url: '/index',
			views: {
				help: {templateUrl: 'templates/help/index.html', controller: 'HelpCtrl'}
			}
		})
		.state('help.view', {
			url: '/view/:helpId',
			views: {
				help: {templateUrl: 'templates/help/view.html', controller: 'HelpCtrl'}
			}
		})

		// Settings
		.state('settings', {url: "/settings", abstract: true, templateUrl: "templates/common/tabs.html", controller: "CommonTabsCtrl"})
		.state('settings.personal', {
			url: '/personal',
			views: {
				settings: {templateUrl: 'templates/common/settings.html', controller: 'SettingsPersonalCtrl'}
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
			try {
				return '/' + $rootScope.roleInfix() + '/dashboard';
			}
			catch (exception) {
				return '/dashboard';
			}
		}
	});
});