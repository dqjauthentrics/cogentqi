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
		.state('professionalDashboard', {
			url: '/professional/dashboard', templateUrl: 'templates/professional/dashboard.html', controller: 'ProfDashboardCtrl'
		})

		// Manager
		.state('managerDashboard', {
			url: '/manager/dashboard', templateUrl: 'templates/manager/dashboard.html', controller: 'DashboardCtrl'
		})

		// Administrator
		.state('administratorDashboard', {
			url: '/administrator/dashboard', templateUrl: 'templates/administrator/dashboard.html', controller: 'AdminDashboardCtrl'
		})
		.state('administratorSchedule', {
			url: '/administrator/schedule', templateUrl: 'templates/administrator/schedule.html', controller: 'AdminScheduleCtrl'
		})
		.state('administratorProgress', {
			url: '/administrator/progress', templateUrl: 'templates/administrator/progress.html', controller: 'AdminProgressCtrl'
		})
		.state('administratorConfiguration', {
			url: '/administrator/configuration', templateUrl: 'templates/administrator/configuration.html', controller: 'SettingsAdminCtrl'
		})

		// Assessments
		.state('assessmentMatrixOrg', {
			url: '/assessment/matrix/:organizationId',
			params: {organizationId: {value: "", squash: true}},
			templateUrl: 'templates/assessment/matrix.html',
			controller: 'AssessmentMatrixCtrl'
		})
		.state('assessmentView', {
			url: '/assessment/view/:assessmentId', templateUrl: 'templates/assessment/view.html', controller: 'AssessmentViewCtrl'
		})
		.state('assessmentNew', {
			url: '/assessment/new/:memberId/:assessmentId', templateUrl: 'templates/assessment/view.html', controller: 'AssessmentViewCtrl'
		})
		.state('assessmentList', {
			url: '/assessment/list', templateUrl: 'templates/assessment/list.html', controller: 'AssessmentListCtrl'
		})

		// Modules
		.state('moduleList', {
			url: '/module/list', templateUrl: 'templates/module/list.html', controller: 'ModuleListCtrl'
		})

		// Resources
		.state('resourceView', {
			url: '/resource/view/:resourceId', templateUrl: 'templates/resource/view.html', controller: 'ResourceViewCtrl'
		})
		.state('resourceList', {
			url: '/resource/list', templateUrl: 'templates/resource/list.html', controller: 'ResourceListCtrl'
		})
		.state('resourceEdit', {
			url: '/resource/edit/:resourceId', templateUrl: 'templates/resource/edit.html', controller: 'ResourceEditCtrl'
		})
		.state('resourceConfigure', {
			url: '/resource/configure', templateUrl: 'templates/resource/configList.html', controller: 'ResourceListCtrl'
		})
		.state('resourceAlignment', {
			url: '/resource/alignment/:resourceId', templateUrl: 'templates/resource/alignment.html', controller: 'ResourceAlignmentCtrl'
		})

		// Members
		.state('memberView', {
			url: '/member/view/:memberId', templateUrl: 'templates/member/view.html', controller: 'MemberViewCtrl'
		})
		.state('memberNotes', {
			url: '/member/notes/:memberId', templateUrl: 'templates/member/notes.html', controller: 'MemberNotesCtrl'
		})
		.state('memberProgress', {
			url: '/member/progress/:memberId', templateUrl: 'templates/member/progress.html', controller: 'MemberProgressCtrl'
		})
		.state('memberBarprogress', {
			url: '/member/barProgress/:memberId', templateUrl: 'templates/member/barProgress.html', controller: 'MemberBarProgressCtrl'
		})
		.state('memberList', {
			url: '/member/list', templateUrl: 'templates/member/list.html', controller: 'MemberListCtrl'
		})

		// Organizations
		.state('organizationView', {
			url: '/organization/view/:organizationId', templateUrl: 'templates/organization/list.html', controller: 'OrganizationCtrl'
		})
		.state('organizationList', {
			url: '/organization/list', templateUrl: 'templates/organization/list.html', controller: 'OrganizationCtrl'
		})

		// Outcomes
		.state('outcomeView', {
			url: '/outcome/view/:outcomeId', templateUrl: 'templates/outcome/view.html', controller: 'OutcomeViewCtrl'
		})
		.state('outcomeOrganization', {
			url: '/outcome/organization', templateUrl: 'templates/outcome/organizationOutcomes.html', controller: 'OutcomeOrganizationCtrl'
		})
		.state('outcomeAlignments', {
			url: '/outcome/alignments', templateUrl: 'templates/outcome/alignments.html', controller: 'OutcomeAlignmentsCtrl'
		})
		.state('outcomeAlignment', {
			url: '/outcome/alignment/:outcomeId', templateUrl: 'templates/outcome/alignment.html', controller: 'OutcomeAlignmentCtrl'
		})

		// Events
		.state('eventEdit', {
			url: '/event/edit/:eventId', templateUrl: 'templates/event/edit.html', controller: 'EventEditCtrl'
		})
		.state('eventCatalog', {
			url: '/event/catalog', templateUrl: 'templates/event/catalog.html', controller: 'EventCatalogCtrl'
		})
		.state('eventAlignment', {
			url: '/event/alignment/:eventId', templateUrl: 'templates/event/alignment.html', controller: 'EventAlignmentCtrl'
		})

		// Instruments
		.state('instrumentView', {
			url: '/instrument/view/:instrumentId', templateUrl: 'templates/instrument/view.html', controller: 'InstrumentCtrl'
		})
		.state('instrumentList', {
			url: '/instrument/list', templateUrl: 'templates/instrument/list.html', controller: 'InstrumentCtrl'
		})

		// Help
		.state('helpList', {
			url: '/help/index', templateUrl: 'templates/help/index.html', controller: 'HelpCtrl'
		})
		.state('helpView', {
			url: '/help/view/:helpId', templateUrl: 'templates/help/view.html', controller: 'HelpCtrl'
		})

		// Settings
		.state('settingsPersonal', {
			url: '/settings/personal', templateUrl: 'templates/common/settings.html', controller: 'SettingsPersonalCtrl'
		})

		// Reports
		.state('reports', {
			url: '/reports', templateUrl: 'templates/reports/index.html', controller: 'ReportsIndexCtrl'
		})
		.state('reportsResourceAnalysis', {
			url: '/reports/resourceAnalysis', templateUrl: 'templates/reports/resourceAnalysis.html', controller: 'ReportsResourceAnalysisCtrl'
		})

	;

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