'use strict';

angular.module('app.instruments', ['ngResource']).service('Instruments', function ($resource, Utility) {
	var svc = this;
	svc.SECTION_ALL = -100;
	svc.SECTION_SUMMARY = -101;

	svc.instruments = [];
	svc.currInstrumentIdx = 0;
	svc.currInstrumentId = null;
	svc.currSectionIdx = 0;

	svc.retrieve = function () {
		if (svc.instruments.length == 0) {
			$resource('/api/instrument/:id', {id: '@id'}, {update: {method: 'PUT'}}).query().$promise.then(function (data) {
				console.log("instruments: retrieved:", data);
				svc.instruments = data;
				for (var i = 0; i < svc.instruments.length; i++) {
					var instrument = svc.instruments[i];
					var groups = instrument.questionGroups;
					var gLen = instrument.questionGroups.length;
					instrument.sections = [];
					console.log("found ", gLen, " groups for instrument id", instrument.id);
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
			});
		}
		console.log("instruments retrieval request", svc.instruments);
		return svc.instruments;
	};

	svc.getCurrent = function () {
		var instrument = svc.instruments[svc.currInstrumentIdx];
		if (!Utility.empty(instrument) && Utility.empty(svc.currInstrumentId)) {
			svc.currInstrumentId = instrument.id;
		}
		return instrument;
	};

	svc.setCurrent = function (instrumentId) {
		var current = null;
		for (var i = 0; i < svc.instruments.length; i++) {
			if (svc.instruments[i].id == instrumentId) {
				svc.currInstrumentId = instrumentId;
				svc.currInstrumentIdx = i;
				svc.currSectionIdx = 0;
				current = svc.instruments[i];
			}
		}
		return current;
	};

	svc.find = function (instrumentId) {
		if (instrumentId == null) {
			instrumentId = 1;
			svc.currentInstrumentId = instrumentId;
		}
		for (var i = 0; i < svc.instruments.length; i++) {
			if (svc.instruments[i].id == instrumentId) {
				return svc.instruments[i];
			}
		}
		return null;
	};

	svc.findSections = function (instrumentId) {
		var instrument = svc.find(instrumentId);
		if (instrument !== null) {
			return instrument.sections;
		}
		return [];
	};

	svc.currentQuestions = function () {
		return svc.instruments[svc.currInstrumentIdx].questions;
	};

	svc.findQuestion = function (questionId) {
		for (var i = 0; i < svc.instruments.length; i++) {
			for (var j = 0; j < svc.instruments[i].questions.length; j++) {
				if (svc.instruments[i].questions[j].id == questionId) {
					return svc.instruments[i].questions[j];
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

	svc.currSections = function () {
		return svc.instruments[svc.currInstrumentIdx].sections;
	};

	svc.sectionViewAll = function () {
		svc.currSectionIdx = svc.SECTION_ALL;
	};
	svc.sectionIsAll = function () {
		return svc.currSectionIdx == svc.SECTION_ALL;
	};
	svc.sectionViewSummary = function () {
		svc.currSectionIdx = svc.SECTION_SUMMARY;
	};
	svc.sectionIsSummary = function () {
		return svc.currSectionIdx == svc.SECTION_SUMMARY;
	};
	svc.sectionIsCurrent = function (sectionId) {
		var isCurrent = (
		svc.instruments.length > 0 && !Utility.empty(svc.instruments[svc.currInstrumentIdx].sections) &&
		svc.instruments[svc.currInstrumentIdx].sections[svc.currSectionIdx].id == sectionId
		);
		return isCurrent;
	};
	svc.sectionCurrentName = function () {
		var name = '';
		if (svc.instruments.length > 0 && !Utility.empty(svc.instruments[svc.currInstrumentIdx].sections)) {
			if (svc.currSectionIdx == svc.SECTION_ALL) {
				return 'Section Summary';
			}
			if (svc.currSectionIdx >= 0 && svc.currSectionIdx < svc.instruments[svc.currInstrumentIdx].sections.length) {
				name = svc.instruments[svc.currInstrumentIdx].sections[svc.currSectionIdx].name;
			}
		}
		return name;
	};
	svc.sectionPreviousName = function () {
		if (svc.instruments.length > 0 && Array.isArray(svc.instruments[svc.currInstrumentIdx].sections)) {
			if (svc.currSectionIdx >= 0) {
				return svc.instruments[svc.currInstrumentIdx].sections[svc.currSectionIdx].previous;
			}
			else {
				return svc.instruments[svc.currInstrumentIdx].sections[0].previous;
			}
		}
		return null;
	};
	svc.sectionNextName = function () {
		if (svc.instruments.length > 0 && Array.isArray(svc.instruments[svc.currInstrumentIdx].sections)) {
			if (svc.currSectionIdx >= 0) {
				return svc.instruments[svc.currInstrumentIdx].sections[svc.currSectionIdx].next;
			}
			else {
				return svc.instruments[svc.currInstrumentIdx].sections[(svc.instruments[svc.currInstrumentIdx].sections.length - 1)].next;
			}
		}
		return null;
	};
	svc.sectionNext = function () {
		if (svc.instruments.length > 0 && svc.currSectionIdx < svc.instruments[svc.currInstrumentIdx].sections.length - 1) {
			svc.currSectionIdx++;
		}
		else {
			svc.currSectionIdx = 0;
		}
		if (svc.currSectionIdx < 0) {
			svc.currSectionIdx = 0;
		}
	};
	svc.sectionPrevious = function () {
		if (svc.currSectionIdx > 0) {
			svc.currSectionIdx--;
		}
		else {
			if (svc.instruments.length > 0 && Array.isArray(svc.instruments[svc.currInstrumentIdx].sections)) {
				svc.currSectionIdx = svc.instruments[svc.currInstrumentIdx].sections.length - 1;
			}
		}
	};
	svc.sectionIsFirst = function () {
		return svc.currSectionIdx <= 0;
	};
	svc.sectionIsLast = function () {
		if (svc.instruments.length > 0 && Array.isArray(svc.instruments[svc.currInstrumentIdx].sections)) {
			return svc.currSectionIdx >= svc.instruments[svc.currInstrumentIdx].sections.length - 1;
		}
		return false;
	};

});