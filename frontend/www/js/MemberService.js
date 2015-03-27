'use strict';

angular.module('app.members', ['app.evaluations']).service('Members', function ($http, $cookieStore, Installation, Utility) {
	var svc = this;
	svc.members = false;
	svc.apiUrl = "/api/member";

	svc.initialize = function (organizationId) {
		var user = $cookieStore.get('user');
		if (svc.members === false && !Utility.empty(user)) {
			svc.members = true;
			if (Utility.empty(organizationId)) {
				organizationId = user.organizationId;
			}
			var url = svc.apiUrl + '/organization/' + organizationId;
			$http.get(url).
				success(function (data, status, headers, config) {
							svc.members = data.result;
							console.log("members initialized", svc.members);
						}).
				error(function (data, status, headers, config) {
						  console.log("ERROR: unable to retrieve members.");
					  });
		}
	};

	svc.getMembers = function () {
		return svc.members;
	};

	svc.find = function (memberId) {
		for (var i = 0; i < svc.members.length; i++) {
			if (parseInt(svc.members[i].id) === parseInt(memberId)) {
				return svc.members[i];
			}
		}
		return null;
	};

	svc.numBadges = function (member) {
		var num = 0;
		if (!Utility.empty(member) && !Utility.empty(member.badges)) {
			num = member.badges.length;
		}
		return num.toString();
	};

	svc.roleName = function (member) {
		var roleName = "-unknown role-";
		if (!Utility.empty(member)) {
			roleName = member.roleId;
			switch (member.roleId) {
				case "S":
					return "System Administrator";
				case "P":
					return "Pharmacist";
				case "T":
					return "Pharmacy Technician";
				case "A":
					return "Administrator";
				case "M":
					return "Manager";
			}
		}
		return roleName;
	};

	svc.findLastEvaluation = function (member) {
		if (!Utility.empty(member) && !Utility.empty(member.evaluations)) {
			return member.evaluations[0];
		}
		return null;
	};

});
