/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('OrganizationControllers', [])

	.controller(
		'OrganizationCtrl',
		function ($scope, $cookieStore, $stateParams, Utility, Icons, Organizations, Members) {
			$scope.data = {canEdit: true, organizations: [], currentMembers: undefined, currentOrg: {}, parentOrg: {}};
			$scope.Members = Members;  //@todo currently need to pass through to memberItem tag
			var user = $cookieStore.get('user');

			$scope.loadOrganizations = function (organizationId) {
				if (!Utility.empty(organizationId)) {
					Utility.getResource(Organizations.retrieve(organizationId), function (response) {
						if (!Utility.empty(response) && !Utility.empty(response.data)) {
							$scope.data.organizations = response.data;
							$scope.data.parentOrg = response.data[0];
							response.data.shift();
							$scope.setCurrentOrg($scope.data.parentOrg);
						}
					});
				}
			};
			$scope.setCurrentOrg = function (organization) {
				$scope.data.currentOrg = organization;
				$scope.data.currentMembers = [];
				if (!Utility.empty(organization)) {
					Organizations.members(organization.id).query(function (response) {
						$scope.data.currentMembers = response.data;
					});
				}
			};
			$scope.listIcon = function (organization) {
				var icon = organization.nc > 0 ? Icons.tree : Icons.organization;
				if (organization.dp) {
					icon = Icons.group;
				}
				return icon;
			};
			$scope.save = function () {
				$ionicPopup.alert({title: 'Demonstration', template: 'Sorry, this is not available in demonstration.'});
			};
			$scope.setDirty = function () {
				$scope.data.dirty = true;
			};
			$scope.isDirty = function () {
				return $scope.data.dirty;
			};
			$scope.drilldown = function (organizationId) {
				window.location.href = '/#/administrator/organization/' + organizationId;
			};
			$scope.orgMatrix = function (organizationId) {
				window.location = "#/assessment/matrix/" + organizationId;
			};
			$scope.isCurrent = function (organization) {
				return !Utility.empty(organization) && !Utility.empty($scope.data.currentOrg) && organization.id == $scope.data.currentOrg.id;
			};

			var organizationId = null;
			if (!Utility.empty($stateParams) && !Utility.empty($stateParams.organizationId)) {
				organizationId = $stateParams.organizationId;
			}
			else {
				if (!Utility.empty(user)) {
					organizationId = user.oi;
				}
			}
			$scope.loadOrganizations(organizationId);

		})
;