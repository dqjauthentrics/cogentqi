/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('app')
	.filter('currentDateTime', [
		'$filter', function ($filter) {
			return function () {
				return $filter('date')(new Date(), 'medium');
			};
		}
	])
	.filter('replace', [
		'$filter', function ($filter) {
			return function (src, searchText, replaceText) {
				return src.replace(searchText, replaceText);
			};
		}
	])
	.filter('ellipsify', [
		'$filter', function ($filter) {
			return function (src, maxLen) {
				if (src && src !== undefined && src.length > maxLen + 3) {
					return src.substring(0, maxLen) + '...';
				}
				return src;
			};
		}
	])
	.filter("timeAgo", function () {
				//time: the time
				//local: compared to what time? default: now
				//raw: whether you want in a format of "5 minutes ago", or "5 minutes"
				return function (time, local, raw) {
					if (!time) {
						return "";
					}

					if (!local) {
						(local = Date.now())
					}

					if (angular.isDate(time)) {
						time = time.getTime();
					}
					else if (typeof time === "string") {
						time = new Date(time).getTime();
					}

					if (angular.isDate(local)) {
						local = local.getTime();
					}
					else if (typeof local === "string") {
						local = new Date(local).getTime();
					}

					if (typeof time !== 'number' || typeof local !== 'number') {
						return;
					}

					var
						offset = Math.abs((local - time) / 1000),
						span   = [],
						MINUTE = 60,
						HOUR   = 3600,
						DAY    = 86400,
						WEEK   = 604800,
						MONTH  = 2629744,
						YEAR   = 31556926,
						DECADE = 315569260;

					if (offset <= MINUTE) {
						span = ['', raw ? 'now' : 'less than a minute'];
					}
					else if (offset < (MINUTE * 60)) {
						span = [Math.round(Math.abs(offset / MINUTE)), 'min'];
					}
					else if (offset < (HOUR * 24)) {
						span = [Math.round(Math.abs(offset / HOUR)), 'hr'];
					}
					else if (offset < (DAY * 7)) {
						span = [Math.round(Math.abs(offset / DAY)), 'day'];
					}
					else if (offset < (WEEK * 52)) {
						span = [Math.round(Math.abs(offset / WEEK)), 'week'];
					}
					else if (offset < (YEAR * 10)) {
						span = [Math.round(Math.abs(offset / YEAR)), 'year'];
					}
					else if (offset < (DECADE * 100)) {
						span = [Math.round(Math.abs(offset / DECADE)), 'decade'];
					}
					else {
						span = ['', 'a long time'];
					}

					span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
					span = span.join(' ');

					if (raw === true) {
						return span;
					}
					return (time <= local) ? span + ' ago' : 'in ' + span;
				}
			})
	.filter('tel', function () {
				return function (tel) {
					if (!tel) { return ''; }

					var value = tel.toString().trim().replace(/^\+/, '');

					if (value.match(/[^0-9]/)) {
						return tel;
					}

					var country, city, number;

					switch (value.length) {
						case 10: // +1PPP####### -> C (PPP) ###-####
							country = 1;
							city = value.slice(0, 3);
							number = value.slice(3);
							break;

						case 11: // +CPPP####### -> CCC (PP) ###-####
							country = value[0];
							city = value.slice(1, 4);
							number = value.slice(4);
							break;

						case 12: // +CCCPP####### -> CCC (PP) ###-####
							country = value.slice(0, 3);
							city = value.slice(3, 5);
							number = value.slice(5);
							break;

						default:
							return tel;
					}

					if (country == 1) {
						country = "";
					}

					number = number.slice(0, 3) + '-' + number.slice(3);

					return (country + " (" + city + ") " + number).trim();
				};
			})
;