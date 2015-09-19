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

	/**
	 * Administrator user states.
	 */
		.state('administrator', {url: "/administrator", templateUrl: "templates/common/tabs.html", controller: "AdminTabsCtrl"})

		.state('administrator.dashboard', {
			url: '/dashboard',
			views: {
				dashboard: {templateUrl: 'templates/administrator/dashboard.html', controller: 'AdminDashboardCtrl'}
			}
		})
		.state('administrator.organization', {
			url: '/organization',
			views: {
				organization: {templateUrl: 'templates/administrator/organizationOverview.html', controller: 'AdminOrganizationCtrl'}
			}
		})
		.state('administrator.organizationSpecific', {
			url: '/organization/:organizationId',
			views: {
				organization: {templateUrl: 'templates/administrator/organizationOverview.html', controller: 'AdminOrganizationCtrl'}
			}
		})
		.state('administrator.schedule', {
			url: '/schedule',
			views: {
				schedule: {templateUrl: 'templates/administrator/schedule.html', controller: 'AdminScheduleCtrl'}
			}
		})
		.state('administrator.outcomes', {
			url: '/outcomes',
			views: {
				outcomes: {templateUrl: 'templates/administrator/outcomes.html', controller: 'AdminOutcomeCtrl'}
			}
		})
		.state('administrator.alignment', {
			url: '/alignment/:resourceId',
			views: {
				settings: {templateUrl: 'templates/administrator/alignment.html', controller: 'AdminAlignmentCtrl'}
			}
		})
		.state('administrator.outcome', {
			url: '/alignment/outcome/:outcomeId',
			views: {
				settings: {templateUrl: 'templates/administrator/outcome.html', controller: 'AdminAlignmentCtrl'}
			}
		})
		.state('administrator.assessmentMatrix', {
			url: '/dashboard/matrix/:organizationId?/',
			views: {
				dashboard: {templateUrl: 'templates/administrator/assessmentMatrix.html', controller: 'AdminMatrixCtrl'}
			}
		})
		.state('administrator.alignments', {
			url: '/alignments',
			views: {settings: {templateUrl: 'templates/administrator/alignments.html', controller: 'AdminAlignmentsCtrl'}}
		})
		.state('administrator.instruments', {
			url: '/instruments',
			views: {settings: {templateUrl: 'templates/administrator/instruments.html', controller: 'AdminInstrumentsCtrl'}}
		})
		.state('administrator.instrument', {
			url: '/instrument/:instrumentId',
			views: {settings: {templateUrl: 'templates/administrator/instrument.html', controller: 'AdminInstrumentsCtrl'}}
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
		.state('administrator.resourceDetail', {
			url: '/resource/:resourceId',
			views: {
				resources: {templateUrl: 'templates/manager/resource.html', controller: 'ResourceCtrl'}
			}
		})
		.state('administrator.resources', {
			url: '/resources',
			views: {
				resources: {templateUrl: 'templates/manager/resources.html', controller: 'ResourceCtrl'}
			}
		})
		.state('administrator.settings', {
			url: '/settings',
			views: {settings: {templateUrl: 'templates/administrator/settings.html', controller: 'AdminSettingsCtrl'}}
		})

	/**
	 * Professional user states.
	 */
		.state('professional', {url: "/professional", abstract: true, templateUrl: "templates/common/tabs.html"})

		.state('professional.dashboard', {
			url: '/dashboard',
			views: {
				dashboard: {templateUrl: 'templates/professional/dashboard.html', controller: 'ProfDashboardCtrl'}
			}
		})
		.state('professional.help', {
			url: '/help',
			views: {
				help: {templateUrl: 'templates/professional/help.html', controller: 'ProfHelpCtrl'}
			}
		})
		.state('professional.resources', {
			url: '/resources',
			views: {
				resources: {templateUrl: 'templates/manager/resources.html', controller: 'ResourceCtrl'}
			}
		})
		.state('professional.settings', {
			url: '/settings',
			views: {settings: {templateUrl: 'templates/professional/settings.html', controller: 'ProfSettingsCtrl'}}
		})

	/**
	 * Manager user states.
	 */
		.state('manager', {url: "/manager", abstract: true, templateUrl: "templates/common/tabs.html"})

		.state('manager.dashboard', {
			url: '/dashboard',
			views: {
				dashboard: {
					templateUrl: 'templates/manager/dashboard.html', controller: 'DashboardCtrl'
				}
			}
		})
		.state('manager.assessmentMatrix', {
			url: '/dashboard/matrix/:organizationId?/',
			views: {
				dashboard: {templateUrl: 'templates/common/assessmentMatrix.html', controller: 'MgrMatrixCtrl'}
			}
		})
		.state('manager.outcomes', {
			url: '/outcomes',
			views: {
				outcomes: {templateUrl: 'templates/manager/outcomes.html', controller: 'OutcomeCtrl'}
			}
		})
		.state('manager.members', {
			url: '/members',
			views: {
				members: {templateUrl: 'templates/manager/members.html', controller: 'MembersCtrl'}
			}
		})
		.state('manager.member', {
			url: '/member/:memberId',
			views: {
				members: {templateUrl: 'templates/manager/member.html', controller: 'MemberCtrl'}
			}
		})
		.state('manager.progress', {
			url: '/member/progress/:memberId',
			views: {
				members: {templateUrl: 'templates/manager/progress.html', controller: 'MemberProgressCtrl'}
			}
		})
		.state('manager.memberProgress', {
			url: '/member/barProgress/:memberId',
			views: {
				members: {templateUrl: 'templates/manager/memberProgressBars.html', controller: 'MemberBarProgressCtrl'}
			}
		})
		.state('manager.memberNotes', {
			url: '/member/notes/:memberId',
			views: {
				members: {templateUrl: 'templates/manager/memberNotes.html', controller: 'MemberNotesCtrl'}
			}
		})
		.state('manager.assessments', {
			url: '/assessments',
			views: {
				assessments: {templateUrl: 'templates/assessment/list.html', controller: 'AssessmentListCtrl'}
			}
		})
		.state('manager.assessment', {
			url: '/assessment/:assessmentId',
			views: {
				assessments: {templateUrl: 'templates/common/view.html', controller: 'AssessmentCtrl'}
			}
		})

		.state('manager.newAssessment', {
			url: '/assessment/n/:memberId',
			views: {
				assessments: {templateUrl: 'templates/common/view.html', controller: 'AssessmentCtrl'}
			}
		})
		.state('manager.planning', {
			url: '/planning',
			views: {
				resources: {templateUrl: 'templates/manager/planning.html', controller: 'PlanningCtrl'}
			}
		})
		.state('manager.resources', {
			url: '/resources',
			views: {
				resources: {templateUrl: 'templates/manager/resources.html', controller: 'ResourceCtrl'}
			}
		})
		.state('manager.resourceDetail', {
			url: '/resource/:resourceId',
			view: {
				resources: {templateUrl: 'templates/manager/resource.html', controller: 'ResourceCtrl'}
			}
		})
		.state('manager.assessmentEmpSection', {
			url: '/assessment/:assessmentId/:memberId/:sectionIdx',
			views: {
				assessments: {templateUrl: 'templates/common/view.html', controller: 'AssessmentCtrl'}
			}
		})
		.state('manager.latestassessment', {
			url: '/assessment/:memberId',
			views: {
				assessments: {templateUrl: 'templates/common/view.html', controller: 'AssessmentCtrl'}
			}
		})
		.state('manager.settings', {
			url: '/settings',
			views: {
				settings: {templateUrl: 'templates/manager/settings.html', controller: 'MgrSettingsCtrl'}
			}
		})

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

	;


	//$urlRouterProvider.otherwise('/manager/dashboard');
	$urlRouterProvider.otherwise(function ($injector, $location) {
		var $cookieStore = $injector.get('$cookieStore');
		var user = $cookieStore.get('user');
		if (user !== undefined && user !== null) {
			return user.home;
		}
		else {
			return '/professional/dashboard';
		}
	});
});