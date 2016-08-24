/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Messages', []).service('Messages', [
	"$ionicPopup", "$http", "Utility",
	function ($ionicPopup, $http, Utility) {
		var svc = this;

		svc.sendText = function (member, message) {
			if (!Utility.empty(message)) {
				var user = $cookieStore.get('user');
				$http.post("/api3/message/send", {senderId: user.id, memberId: member.id, message: message})
					.then(function (data, status, headers, config) {
							  Utility.popup('Done', 'Message sent.');
						  },
						  function (data, status, headers, config) {
							  Utility.popup('Sorry!', 'There was a problem sending the message.');
						  });
			}
		};
	}
]);