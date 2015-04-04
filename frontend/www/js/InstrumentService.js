'use strict';

angular.module('app.instruments', ['ngResource']).service('Instruments', function ($resource, Utility) {
	var svc = this;
	svc.SECTION_ALL = -100;
	svc.SECTION_SUMMARY = -101;

	svc.currentSectionIdx = 0;

	svc.retrieve = function () {
		return $resource('/api/instrument/:id', {}, {});
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
					var previous = (j > 0 ? groups[(j - 1)].tag : groups[(groups.length - 1)].tag);
					var next = j < gLen - 1 ? groups[(j + 1)].tag : groups[0].tag;
					instrument.sections[j] = {
						id: questionGroup.id,
						number: questionGroup.number,
						name: questionGroup.tag,
						next: next,
						previous: previous,
						questions: []
					};
					for (var k = 0; k < instrument.questions.length; k++) {
						if (instrument.questions[k].questionGroupId == instrument.sections[j].id) {
							instrument.sections[j].questions.push(instrument.questions[k]);
						}
					}
				}
			}
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
							return svc.instruments.alignments[i].weight;
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
		var names = [];
		if (!Utility.empty(instrument) && !Utility.empty(svc.currentSectionIdx) && Array.isArray(instrument.sections)) {
			var sections = instrument.sections;
			for (var i = 0; i < sections.length; i++) {
				if (svc.currentSectionIdx > svc.SECTION_SUMMARY) {
					if (i == svc.currentSectionIdx || svc.currentSectionIdx == svc.SECTION_ALL) {
						for (var j = 0; j < sections[i].questions.length; j++) {
							names.push(svc.matrixName(sections[i].questions[j].name, maxLength));
						}
					}
				}
				else {
					names.push(svc.matrixName(sections[i].name, maxLength));
				}
			}
		}
		return names;
	};


	svc.sectionViewAll = function () {
		svc.currentSectionIdx = svc.SECTION_ALL;
	};
	svc.sectionIsAll = function () {
		return svc.currentSectionIdx == svc.SECTION_ALL;
	};
	svc.sectionViewSummary = function () {
		svc.currentSectionIdx = svc.SECTION_SUMMARY;
	};
	svc.sectionIsSummary = function () {
		return svc.currentSectionIdx == svc.SECTION_SUMMARY;
	};
	svc.sectionIsCurrent = function (instrument, sectionId) {
		return (instrument.length > 0 && !Utility.empty(instrument.sections) && instrument.sections[svc.currentSectionIdx].id == sectionId);
	};
	svc.sectionCurrentName = function (instrument) {
		var name = '';
		if (!Utility.empty(instrument) && !Utility.empty(instrument.sections)) {
			if (svc.currentSectionIdx == svc.SECTION_ALL) {
				return 'Section Summary';
			}
			if (svc.currentSectionIdx >= 0 && svc.currentSectionIdx < instrument.sections.length) {
				name = instrument.sections[svc.currentSectionIdx].name;
			}
		}
		return name;
	};
	svc.sectionPreviousName = function (instrument) {
		if (!Utility.empty(instrument) && Array.isArray(instrument.sections)) {
			if (svc.currentSectionIdx >= 0) {
				return instrument.sections[svc.currentSectionIdx].previous;
			}
			else {
				return instrument.sections[0].previous;
			}
		}
		return null;
	};
	svc.sectionNextName = function (instrument) {
		if (!Utility.empty(instrument) && Array.isArray(instrument.sections)) {
			if (svc.currentSectionIdx >= 0) {
				return instrument.sections[svc.currentSectionIdx].next;
			}
			else {
				return instrument.sections[(instrument.sections.length - 1)].next;
			}
		}
		return null;
	};
	svc.sectionNext = function (instrument) {
		if (!Utility.empty(instrument) && svc.currentSectionIdx < instrument.sections.length - 1) {
			svc.currentSectionIdx++;
		}
		else {
			svc.currentSectionIdx = 0;
		}
		if (svc.currentSectionIdx < 0) {
			svc.currentSectionIdx = 0;
		}
	};
	svc.sectionPrevious = function (instrument) {
		if (svc.currentSectionIdx > 0) {
			svc.currentSectionIdx--;
		}
		else {
			if (!Utility.empty(instrument) && Array.isArray(instrument.sections)) {
				svc.currentSectionIdx = instrument.sections.length - 1;
			}
		}
	};
	svc.sectionIsFirst = function () {
		return svc.currentSectionIdx <= 0;
	};
	svc.sectionIsLast = function (instrument) {
		if (!Utility.empty(instrument) && Array.isArray(instrument.sections)) {
			return svc.currentSectionIdx >= instrument.sections.length - 1;
		}
		return false;
	};

})
;