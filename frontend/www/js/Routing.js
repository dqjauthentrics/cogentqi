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
		.state('administrator', {url: "/administrator", abstract: true, templateUrl: "templates/administrator/tabs.html"})

		.state('administrator.dashboard', {
				   url: '/dashboard',
				   views: {
					   administratorDashboard: {templateUrl: 'templates/administrator/dashboard.html', controller: 'AdminDashboardCtrl'}
				   }
			   })
		.state('administrator.organization', {
				   url: '/organization',
				   views: {
					   administratorOrganization: {templateUrl: 'templates/administrator/organizationOverview.html', controller: 'AdminOrganizationCtrl'}
				   }
			   })
		.state('administrator.organizationSpecific', {
				   url: '/organization/:organizationId',
				   views: {
					   administratorOrganization: {templateUrl: 'templates/administrator/organizationOverview.html', controller: 'AdminOrganizationCtrl'}
				   }
			   })
		.state('administrator.outcomes', {
				   url: '/outcomes',
				   views: {
					   administratorOutcomes: {templateUrl: 'templates/administrator/outcomes.html', controller: 'AdminOutcomeCtrl'}
				   }
			   })
		.state('administrator.alignment', {
				   url: '/alignment/:resourceId',
				   views: {
					   administratorAlignments: {templateUrl: 'templates/administrator/alignment.html', controller: 'AdminAlignmentCtrl'}
				   }
			   })
		.state('administrator.outcome', {
				   url: '/alignment/outcome/:outcomeId',
				   views: {
					   administratorAlignments: {templateUrl: 'templates/administrator/outcome.html', controller: 'AdminAlignmentCtrl'}
				   }
			   })
		.state('administrator.assessmentMatrix', {
				   url: '/dashboard/matrix/:organizationId?/',
				   views: {
					   administratorDashboard: {templateUrl: 'templates/administrator/assessmentMatrix.html', controller: 'AdminMatrixCtrl'}
				   }
			   })
		.state('administrator.alignments', {
				   url: '/alignments',
				   views: {administratorAlignments: {templateUrl: 'templates/administrator/alignments.html', controller: 'AdminAlignmentsCtrl'}}
			   })
		.state('administrator.instruments', {
				   url: '/instruments',
				   views: {administratorInstruments: {templateUrl: 'templates/administrator/instruments.html', controller: 'AdminInstrumentsCtrl'}}
			   })
		.state('administrator.instrument', {
				   url: '/instrument/:instrumentId',
				   views: {administratorInstruments: {templateUrl: 'templates/administrator/instrument.html', controller: 'AdminInstrumentsCtrl'}}
			   })
		.state('administrator.planning', {
				   url: '/planning',
				   views: {
					   administratorPlanning: {templateUrl: 'templates/manager/planning.html', controller: 'PlanningCtrl'}
				   }
			   })
		.state('administrator.progress', {
				   url: '/progress',
				   views: {
					   administratorProgress: {templateUrl: 'templates/administrator/progress.html', controller: 'AdminProgressCtrl'}
				   }
			   })
		.state('administrator.resourceDetail', {
				   url: '/resource/:resourceId',
				   views: {
					   administratorResources: {templateUrl: 'templates/manager/resource.html', controller: 'ResourceCtrl'}
				   }
			   })
		.state('administrator.settings', {
				   url: '/settings',
				   views: {administratorSettings: {templateUrl: 'templates/administrator/settings.html', controller: 'AdminSettingsCtrl'}}
			   })

	/**
	 * Professional user states.
	 */
		.state('professional', {url: "/professional", abstract: true, templateUrl: "templates/professional/tabs.html"})

		.state('professional.dashboard', {
				   url: '/dashboard',
				   views: {
					   professionalDashboard: {templateUrl: 'templates/professional/dashboard.html', controller: 'ProfDashboardCtrl'}
				   }
			   })
		.state('professional.help', {
				   url: '/help',
				   views: {
					   professionalHelp: {templateUrl: 'templates/professional/help.html', controller: 'ProfHelpCtrl'}
				   }
			   })
		.state('professional.settings', {
				   url: '/settings',
				   views: {professionalSettings: {templateUrl: 'templates/professional/settings.html', controller: 'ProfSettingsCtrl'}}
			   })

	/**
	 * Manager user states.
	 */
		.state('manager', {url: "/manager", abstract: true, templateUrl: "templates/manager/tabs.html"})

		.state('manager.dashboard', {
				   url: '/dashboard',
				   views: {
					   managerDashboard: {
						   templateUrl: 'templates/manager/dashboard.html', controller: 'DashboardCtrl'
					   }
				   }
			   })
		.state('manager.assessmentMatrix', {
				   url: '/dashboard/matrix/:organizationId?/',
				   views: {
					   managerDashboard: {templateUrl: 'templates/common/assessmentMatrix.html', controller: 'MgrMatrixCtrl'}
				   }
			   })
		.state('manager.outcomes', {
				   url: '/outcomes',
				   views: {
					   managerOutcomes: {templateUrl: 'templates/manager/outcomes.html', controller: 'OutcomeCtrl'}
				   }
			   })
		.state('manager.members', {
				   url: '/members',
				   views: {
					   managerMembers: {templateUrl: 'templates/manager/members.html', controller: 'MembersCtrl'}
				   }
			   })
		.state('manager.member', {
				   url: '/member/:memberId',
				   views: {
					   managerMembers: {templateUrl: 'templates/manager/member.html', controller: 'MemberCtrl'}
				   }
			   })
		.state('manager.progress', {
				   url: '/member/progress/:memberId',
				   views: {
					   managerMembers2: {templateUrl: 'templates/manager/progress.html', controller: 'MemberProgressCtrl'}
				   }
			   })
		.state('manager.memberProgress', {
				   url: '/member/barProgress/:memberId',
				   views: {
					   managerMembers3: {templateUrl: 'templates/manager/memberProgressBars.html', controller: 'MemberBarProgressCtrl'}
				   }
			   })
		.state('manager.memberNotes', {
				   url: '/member/notes/:memberId',
				   views: {
					   managerMembers4: {templateUrl: 'templates/manager/memberNotes.html', controller: 'MemberNotesCtrl'}
				   }
			   })
		.state('manager.assessments', {
				   url: '/assessments',
				   views: {
					   managerAssessments: {templateUrl: 'templates/common/assessments.html', controller: 'AssessmentsCtrl'}
				   }
			   })
		.state('manager.assessment', {
				   url: '/assessment/:assessmentId',
				   views: {
					   managerAssessments: {templateUrl: 'templates/common/assessment.html', controller: 'AssessmentCtrl'}
				   }
			   })

		.state('manager.newAssessment', {
				   url: '/assessment/n/:memberId',
				   views: {
					   managerAssessments: {templateUrl: 'templates/common/assessment.html', controller: 'AssessmentCtrl'}
				   }
			   })
		.state('manager.planning', {
				   url: '/planning',
				   views: {
					   managerResources: {templateUrl: 'templates/manager/planning.html', controller: 'PlanningCtrl'}
				   }
			   })
		.state('manager.resources', {
				   url: '/resources',
				   views: {
					   managerResources: {templateUrl: 'templates/manager/resources.html', controller: 'ResourceCtrl'}
				   }
			   })
		.state('manager.resourceDetail', {
				   url: '/resource/:resourceId',
				   views: {
					   managerResources: {templateUrl: 'templates/manager/resource.html', controller: 'ResourceCtrl'}
				   }
			   })
		.state('manager.assessmentEmpSection', {
				   url: '/assessment/:assessmentId/:memberId/:sectionIdx',
				   views: {
					   managerAssessments: {templateUrl: 'templates/common/assessment.html', controller: 'AssessmentCtrl'}
				   }
			   })
		.state('manager.latestassessment', {
				   url: '/assessment/:memberId',
				   views: {
					   managerAssessments: {templateUrl: 'templates/common/assessment.html', controller: 'AssessmentCtrl'}
				   }
			   })
		.state('manager.settings', {
				   url: '/settings',
				   views: {
					   managerSettings: {templateUrl: 'templates/manager/settings.html', controller: 'MgrSettingsCtrl'}
				   }
			   });

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