/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Instruments', []).service('Instruments', function ($resource, $http, Utility) {
	var svc = this;
	svc.SECTION_ALL = -100;
	svc.SECTION_SUMMARY = -101;
	svc.list = null;
	svc.current = null;
	svc.currentSectionIdx = 0;

	svc.retrieve = function () {
		return $resource('/api3/instrument', {}, {query: {method: 'GET', isArray: false, cache: false}});
	};
	svc.loadAll = function (callbackFn) {
		if (svc.list == null) {
			return $http.get('/api3/instrument')
				.then(
					function (result) {
						if (result.data.status !== 1) {
							return $q.reject(result.data);
						}
						svc.list = result.data.data;
						if (svc.list.length > 0) {
							svc.current = svc.list[0];
						}
						svc.collate(svc.list);
						callbackFn(svc.list);
					},
					function (error) {
						return $q.reject(error);
					}
				);
		}
		else {
			callbackFn(svc.list);
		}
	};

	svc.save = function (instrument, callbackFn) {
		try {
			$http.post("/api3/instrument/save", {instrument: instrument})
				.then(function (data, status, headers, config) {
						  callbackFn(data.data);
					  },
					  function (data, status, headers, config) {
						  callbackFn(data);
					  });
		}
		catch (exception) {
			callbackFn(0, exception);
		}
	};

	svc.groupName = function (group) {
		if (group && group != undefined) {
			return group.nmb + '. ' + group.tag;
		}
		return '';
	};
	svc.collate = function (instruments) {
		if (!Utility.empty(instruments)) {
			for (var i = 0; i < instruments.length; i++) {
				var instrument = instruments[i];
				var groups = instrument.questionGroups;
				var gLen = instrument.questionGroups.length;
				instrument.sections = [];
				for (var j = 0; j < gLen; j++) {
					var questionGroup = groups[j];
					var previous = (j > 0 ? svc.groupName(groups[(j - 1)]) : svc.groupName(groups[(groups.length - 1)]));
					var next = (j < gLen - 1 ? svc.groupName(groups[(j + 1)]) : svc.groupName(groups[0]));
					instrument.sections[j] = {
						id: questionGroup.id,
						nmb: questionGroup.nmb,
						n: questionGroup.tag,
						nxt: next,
						prv: previous,
						questions: []
					};
					if (!Utility.empty(instrument.questions)) {
						for (var k = 0; k < instrument.questions.length; k++) {
							if (!Utility.empty(instrument.questions[k]) && instrument.questions[k].qg == instrument.sections[j].id) {
								instrument.sections[j].questions.push(instrument.questions[k]);
							}
						}
					}
				}
			}
		}
	};
	svc.getCollated = function (callbackFn) {
		if (svc.list == null) {
			Utility.getResource(svc.retrieve(), function (response) {
				if (!Utility.empty(response)) {
					svc.list = response.data;
					if (!Utility.empty(svc.list)) {
						svc.collate(svc.list);
						svc.current = svc.list[0];
						callbackFn(svc.list);
					}
				}
			});
		}
		else {
			callbackFn(svc.list);
		}
	};

	svc.findQuestion = function (instruments, questionId) {
		if (!Utility.empty(instruments) && !Utility.empty(questionId)) {
			for (var i = 0; i < instruments.length; i++) {
				var instrument = instruments[i];
				for (var j = 0; j < instrument.questions.length; j++) {
					if (instrument.questions[j].id == questionId) {
						return instrument.questions[j];
					}
				}
			}
		}
		return null;
	};

	svc.findAlignment = function (instrumentId, resourceId, questionId) {
		if (!Utility.empty(svc.instruments) && Array.isArray(svc.instruments)) {
			for (var i = 0; i < svc.instruments.length; i++) {
				if (parseInt(instrumentId) == parseInt(svc.instruments[i].id)) {
					for (var j = 0; j < svc.instruments[i].alignments.length; j++) {
						var alignment = svc.instruments[i].alignments[j];
						if (parseInt(alignment.questionId) == parseInt(questionId) && parseInt(alignment.resourceId) == parseInt(resourceId)) {
							return svc.instruments.alignments[i].wt;
						}
					}
				}
			}
		}
		return 0;
	};

	svc.matrixName = function (name, maxLength) {
		if (name.length > maxLength) {
			name = name.substr(0, maxLength) + '...';
		}
		return name;
	};

	svc.findMatrixResponseRowHeader = function (instrument, maxLength) {
		if (instrument == undefined) {
			instrument = svc.current;
		}
		var names = [];
		if (!Utility.empty(instrument) && !Utility.empty(svc.currentSectionIdx) && Array.isArray(instrument.sections)) {
			var sections = instrument.sections;
			for (var i = 0; i < sections.length; i++) {
				if (svc.currentSectionIdx > svc.SECTION_SUMMARY) {
					if (i == svc.currentSectionIdx || svc.currentSectionIdx == svc.SECTION_ALL) {
						for (var j = 0; j < sections[i].questions.length; j++) {
							names.push(svc.matrixName(sections[i].questions[j].n, maxLength));
						}
					}
				}
				else {
					names.push(svc.matrixName(sections[i].n, maxLength));
				}
			}
		}
		return names;
	};

	svc.sectionRange = function (instrument, sectionIdx) {
		if (instrument == undefined) {
			instrument = svc.current;
		}
		var range = {start: -1, end: -1};
		if (!Utility.empty(instrument) && !Utility.empty(instrument.sections)) {
			if (sectionIdx == svc.SECTION_ALL) {
				range.start = 0;
				range.end = instrument.questions.length - 1;
			}
			else {
				var stop = sectionIdx;
				range.start = 0;
				range.end = 0;
				for (var z = 0; z <= stop; z++) {
					var sectionLen = instrument.sections[z].questions.length;
					if (z < sectionIdx) {
						range.start += sectionLen;
					}
					else {
						range.end = (range.start + sectionLen) - 1;
					}
				}
			}
		}
		return range;
	};
	svc.inSection = function (instrument, idx) {
		if (instrument == undefined) {
			instrument = svc.current;
		}
		var range = svc.sectionRange(instrument, svc.currentSectionIdx);
		return idx >= range.start && idx <= range.end;
	};
	svc.getSectionNames = function (instrument) {
		if (instrument == undefined) {
			instrument = svc.current;
		}
		var names = [];
		if (!Utility.empty(instrument) && !Utility.empty(instrument.sections)) {
			for (var z = 0; z < instrument.sections.length; z++) {
				names.push(instrument.sections[z].n);
			}
		}
		return names;
	};

	svc.sectionNumber = function (instrument) {
		if (instrument == undefined) {
			instrument = svc.current;
		}
		var number = '';
		if (!Utility.empty(instrument) && !Utility.empty(instrument.sections) && svc.currentSectionIdx >= 0) {
			number = (svc.currentSectionIdx + 1) + '. ';
		}
		return number;
	};
	svc.sectionViewAll = function () {
		svc.currentSectionIdx = svc.SECTION_ALL;
		return svc.currentSectionIdx;
	};
	svc.sectionIsAll = function () {
		return svc.currentSectionIdx == svc.SECTION_ALL;
	};
	svc.sectionViewSummary = function () {
		svc.currentSectionIdx = svc.SECTION_SUMMARY;
		return svc.currentSectionIdx;
	};
	svc.sectionIsSummary = function () {
		return svc.currentSectionIdx == svc.SECTION_SUMMARY;
	};
	svc.sectionIsCurrent = function (instrument, sectionId) {
		if (instrument == undefined) {
			instrument = svc.current;
		}
		var isCurrent = false;
		if (!Utility.empty(instrument)) {
			if (svc.currentSectionIdx == undefined) {
				svc.currentSectionIdx = 0;
			}
			try {
				isCurrent = svc.currentSectionIdx >= 0 && !Utility.empty(instrument) && Array.isArray(instrument.sections) &&
					parseInt(instrument.sections[svc.currentSectionIdx].id) == parseInt(sectionId);
			}
			catch (exception) {
				console.log("exception:", exception);
			}
		}
		return isCurrent;
	};
	svc.sectionCurrentName = function (instrument) {
		if (instrument == undefined) {
			instrument = svc.current;
		}
		var name = '';
		if (!Utility.empty(instrument) && !Utility.empty(instrument.sections)) {
			if (svc.currentSectionIdx == svc.SECTION_ALL) {
				return 'Section Summary';
			}
			if (svc.currentSectionIdx >= 0 && svc.currentSectionIdx < instrument.sections.length) {
				name = instrument.sections[svc.currentSectionIdx].n;
			}
		}
		return name;
	};
	svc.sectionPreviousName = function (instrument) {
		if (instrument == undefined) {
			instrument = svc.current;
		}
		if (!Utility.empty(instrument) && Array.isArray(instrument.sections)) {
			if (svc.currentSectionIdx >= 0) {
				return instrument.sections[svc.currentSectionIdx].prv;
			}
			else {
				return instrument.sections[0].prv;
			}
		}
		return null;
	};
	svc.sectionNextName = function (instrument) {
		if (instrument == undefined) {
			instrument = svc.current;
		}
		if (!Utility.empty(instrument) && Array.isArray(instrument.sections)) {
			if (svc.currentSectionIdx >= 0) {
				return instrument.sections[svc.currentSectionIdx].nxt;
			}
			else {
				return instrument.sections[(instrument.sections.length - 1)].nxt;
			}
		}
		return null;
	};
	svc.go = function(sectionIdx) {
		svc.currentSectionIdx = sectionIdx;
	};
	svc.sectionNext = function (instrument) {
		if (instrument == undefined) {
			instrument = svc.current;
		}
		if (!Utility.empty(instrument) && svc.currentSectionIdx < instrument.sections.length - 1) {
			svc.currentSectionIdx++;
		}
		else {
			svc.currentSectionIdx = 0;
		}
		if (svc.currentSectionIdx < 0) {
			svc.currentSectionIdx = 0;
		}
		return svc.currentSectionIdx;
	};
	svc.sectionPrevious = function (instrument) {
		if (instrument == undefined) {
			instrument = svc.current;
		}
		if (svc.currentSectionIdx > 0) {
			svc.currentSectionIdx--;
		}
		else {
			if (!Utility.empty(instrument) && Array.isArray(instrument.sections)) {
				svc.currentSectionIdx = instrument.sections.length - 1;
			}
		}
		return svc.currentSectionIdx;
	};
	svc.sectionIsFirst = function () {
		return svc.currentSectionIdx <= 0;
	};
	svc.sectionIsLast = function (instrument) {
		if (instrument == undefined) {
			instrument = svc.current;
		}
		if (!Utility.empty(instrument) && Array.isArray(instrument.sections)) {
			return svc.currentSectionIdx >= instrument.sections.length - 1;
		}
		return false;
	};

})
;