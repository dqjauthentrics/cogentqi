'use strict';

angular.module('app.evaluations', ['app.utility', 'app.resources']).service('Evaluations', function ($filter, $http, $cookieStore, Installation, angularLoad, Utility, Resources) {
	var svc = this;
	svc.avg = 0.0;
	svc.avgRound = 0;
	svc.currentSectionIdx = 0;
	svc.initialized = false;
	svc.maxRange = 5;
	svc.instruments = [];
	svc.currentInstrumentId = null;
	svc.sections = [];
	svc.recommendations = [];
	svc.evaluations = [];
	svc.currentEval = null;
	svc.SECTION_ALL = -100;
	svc.SECTION_SUMMARY = -101;

	svc.loadEvaluations = function () {
		var user = $cookieStore.get('user');
		if (Utility.empty(svc.evaluations) && !Utility.empty(user)) {
			svc.evaluations = ['zz'];
			$http.get('/api/evaluation/organization/' + user.organizationId).
				success(function (data, status, headers, config) {
							svc.evaluations = data.result;
						}).
				error(function (data, status, headers, config) {
						  console.log("ERROR: unable to retrieve evaluations.");
					  });
		}
	};
	svc.initialize = function () {
		var user = $cookieStore.get('user');
		if (Utility.empty(svc.instruments) && !Utility.empty(user)) {
			svc.instruments = ['zz'];
			$http.get('/api/instrument/all').
				success(function (data, status, headers, config) {
							svc.instruments = data.result;
							svc.loadEvaluations(user.organizationId);
						}).
				error(function (data, status, headers, config) {
						  console.log("ERROR: unable to retrieve instruments.");
					  });
		}
	};

	svc.findInstrument = function (instrumentId) {
		for (var i = 0; i < svc.instruments.length; i++) {
			if (svc.instruments[i].id == instrumentId) {
				return svc.instruments[i];
			}
		}
		return null;
	};

	svc.getSections = function (instrumentId) {
		if (!Utility.empty(instrumentId) && svc.currentInstrumentId !== instrumentId) {
			svc.currentInstrumentId = instrumentId;
			svc.sections = [];
			for (var i = 0; i < svc.instruments.length; i++) {
				if (svc.instruments[i].id == instrumentId) {
					var instrument = svc.instruments[i];
					var groups = instrument.questionGroups;
					var gLen = instrument.questionGroups.length;
					for (var j = 0; j < gLen; j++) {
						var questionGroup = groups[j];
						var previous = j > 0 ? groups[(j - 1)].tag : groups[0].tag;
						var next = j < gLen - 1 ? groups[(j + 1)].tag : groups[0].tag;
						svc.sections[j] = {id: questionGroup.id, number: questionGroup.number, name: questionGroup.tag, next: next, previous: previous, questions: []};
						for (var k = 0; k < instrument.questions.length; k++) {
							if (instrument.questions[k].questionGroupId == svc.sections[j].id) {
								svc.sections[j].questions.push(instrument.questions[k]);
							}
						}
					}
				}
			}
		}
		return svc.sections;
	};

	svc.get = function (m, evaluationId) {
		$http.get('/api/evaluation/' + evaluationId).
			success(function (data, status, headers, config) {
						svc.currentEval = data.result;
						if (!Utility.empty(svc.currentEval)) {
							svc.currentEval.instrument = svc.findInstrument(svc.currentEval.instrumentId);
							svc.currentEval.member = m.get(svc.currentEval.memberId);
							svc.getSections(svc.currentEval.instrumentId);
							for (var i = 0; i < svc.currentEval.responses.length; i++) {
								for (var j = 0; j < svc.sections.length; j++) {
									for (var k = 0; k < svc.sections[j].questions.length; k++) {
										var instrumentQuestionId = parseInt(svc.sections[j].questions[k].id);
										var responseQuestionId = parseInt(svc.currentEval.responses[i].questionId);
										if (instrumentQuestionId == responseQuestionId) {
											svc.sections[j].questions[k].responseRecord = svc.currentEval.responses[i];
										}
									}
								}
							}
						}
					}).
			error(function (data, status, headers, config) {
					  console.log("ERROR: unable to retrieve evaluation.");
				  });
		return svc.currentEval;
	};

	svc.scorify = function (member) {
		svc.avg = 0;
		svc.avgRound = 0;
		var total = 0;
		var compCount = 0;
		if (!Utility.empty(svc.sections)) {
			for (var i = 0; i < svc.sections.length; i++) {
				var section = svc.sections[i];
				for (var j = 0; j < section.questions.length; j++) {
					var responseValue = !Utility.empty(section.questions[j].responseRecord) ? section.questions[j].responseRecord.responseIndex : 0;
					if (responseValue > 0) {
						total += responseValue;
						compCount++;
					}
				}
			}
			if (total > 0) {
				svc.avg = $filter('number')(total / compCount, 1);
				svc.avgRound = Math.round(svc.avg);
			}
		}
	};
	svc.scoreWord = function (score) {
		var scoreWord = "N/A";
		try {
			switch (parseInt(Math.round(score))) {
				case 1:
					scoreWord = "Unacceptable";
					break;
				case 2:
					scoreWord = "Needs Improvement";
					break;
				case 3:
					scoreWord = "Proficient";
					break;
				case 4:
					scoreWord = "Highly Proficient";
					break;
				case 5:
					scoreWord = "Distinguished";
					break;
				default:
			}
		}
		catch (exception) {
		}
		return scoreWord;
	};
	svc.resourceScore = function (alignmentWeight, memberScore, nAlignments) {
		var score = 0;
		if (memberScore > 0 && nAlignments > 0) {
			score = (alignmentWeight * Math.pow((5 - memberScore), 2)) / nAlignments;
		}
		if (score > 5) {
			score = 5;
		}
		if (score < 0) {
			score = 0;
		}
		return score;
	};
	svc.recommend = function (sections) {
		if (!Utility.empty(sections)) {
			svc.recommendations = [];
			var resourceAlignmentCounts = {};
			for (var k = 0; k < Resources.resources.length; k++) {
				Resources.resources[k].score = 0;
				var resource = Resources.resources[k];
				if (Utility.empty(resourceAlignmentCounts[resource.id])) {
					resourceAlignmentCounts[resource.id] = 0;
				}
				resourceAlignmentCounts[resource.id] += resource.alignments.length;
			}
			if (!Utility.empty(sections)) {
				for (var i = 0; i < sections.length; i++) {
					for (var j = 0; j < sections[i].questions.length; j++) {
						var question = sections[i].questions[j];
						for (k = 0; k < Resources.resources.length; k++) {
							resource = Resources.resources[k];
							var nAlignments = resource.alignments.length;
							for (var z = 0; z < nAlignments; z++) {
								var alignment = resource.alignments[z];
								var resQuestionId = parseInt(alignment.competencyId);
								var questionId = parseInt(question.id);
								if (resQuestionId == questionId) {
									Resources.resources[k].score += svc.resourceScore(alignment.weight, question.responseRecord.responseIndex, resourceAlignmentCounts[resource.id]);
								}
							}
						}
					}
				}
			}
			if (!Utility.empty(Resources.resources)) {
				for (k = 0; k < Resources.resources.length; k++) {
					resource = Resources.resources[k];
					if (resource.score > 5) {
						resource.score = 5;
					}
					if (resource.score < 0) {
						resource.score = 0;
					}
					if (resource.score > 0) {
						svc.recommendations.push({resourceId: resource.id, number: resource.number, name: resource.name, weight: resource.score});
					}
				}
			}
			svc.recommendations = svc.recommendations.sort(function (a, b) {
				return a["weight"] > b["weight"] ? -1 : a["weight"] < b["weight"] ? 1 : 0;
			});
		}
		return svc.recommendations;
	};
	svc.sliderTransform = function (member, question, idx, isUpdate) {
		if (!Utility.empty(question) && !Utility.empty(question.responseRecord)) {
			var slider = $("#question_item_" + question.id);
			var scoreWord = svc.scoreWord(question.responseRecord.responseIndex);
			var levelEl = slider.find("span.bubble.low");
			levelEl.html(scoreWord);
			slider.removeClass(function (index, css) {
				return (css.match(/(^|\s)slider\S+/g) || []).join(' ');
			}).addClass("slider" + question.responseRecord.responseIndex);
			svc.scorify(member);
			if (isUpdate) {
				svc.recommend(svc.sections);
			}
		}
	};
	svc.sliderChange = function (member, question, thing, isUpdate) {
		var idx = thing.$index;
		svc.sliderTransform(member, question, idx, isUpdate);
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
	svc.sectionCurrentName = function () {
		var name = '';
		if (!Utility.empty(svc.competencies)) {
			if (svc.currentSectionIdx == svc.SECTION_ALL) {
				return 'Section Summary';
			}
			if (svc.currentSectionIdx >= 0 && svc.currentSectionIdx < svc.competencies.length) {
				name = svc.sections[svc.currentSectionIdx].name;
			}
		}
		return name;
	};
	svc.sectionPreviousName = function () {
		var name = '';
		if (!Utility.empty(svc.competencies)) {
			if (svc.currentSectionIdx > 0) {
				name = svc.sections[(svc.currentSectionIdx - 1)].name;
			}
			else {
				name = svc.sections[0].text;
			}
		}
		return name;
	};
	svc.sectionNextName = function () {
		var name = '';
		if (!Utility.empty(svc.sections)) {
			var tmpIdx = svc.currentSectionIdx;
			if (tmpIdx < 0) {
				tmpIdx = -1;
			}
			if (tmpIdx < svc.sections.length - 1) {
				name = svc.sections[(tmpIdx + 1)].name;
			}
			else {
				name = svc.sections[0].name;
			}
		}
		return name;
	};
	svc.sectionNext = function () {
		if (svc.currentSectionIdx < svc.sections.length - 1) {
			svc.currentSectionIdx++;
		}
		else {
			svc.currentSectionIdx = 0;
		}
		if (svc.currentSectionIdx < 0) {
			svc.currentSectionIdx = 0;
		}
	};
	svc.sectionPrevious = function () {
		if (svc.currentSectionIdx > 0) {
			svc.currentSectionIdx--;
		}
		else {
			svc.currentSectionIdx = svc.sections.length - 1;
		}
	};
	svc.sectionIsFirst = function () {
		return svc.currentSectionIdx <= 0;
	};
	svc.sectionIsLast = function () {
		return svc.currentSectionIdx >= svc.sections.length - 1;
	};

	svc.getMatrixResponseRowValues = function (currentSectionIdx) {
		var comps = [];
		for (var i = 0; i < member.sections.length; i++) {
			if (currentSectionIdx > svc.SECTION_SUMMARY) {
				if (i == currentSectionIdx || currentSectionIdx == svc.SECTION_ALL) {
					for (var j = 0; j < svc.sections[i].responses.length; j++) {
						comps.push(svc.sections[i].responses[j]);
					}
				}
			}
			else {
				comps.push(svc.sections[i]);
			}
		}
		return comps;
	};
	svc.matrixName = function (name, maxLength) {
		if (name.length > maxLength) {
			name = name.substr(0, maxLength) + '...';
		}
		return name;
	};
	svc.getMatrixResponseRowHeader = function (m, maxLength, currentSectionIdx) {
		var names = [];
		if (m.members.length > 0) {
			var comps = m.members[0].competencies;
			if (!Utility.empty(comps)) {
				for (var i = 0; i < comps.length; i++) {
					if (currentSectionIdx > svc.SECTION_SUMMARY) {
						if (i == currentSectionIdx || currentSectionIdx == svc.SECTION_ALL) {
							for (var j = 0; j < comps[i].children.length; j++) {
								names.push(svc.matrixName(comps[i].children[j].text, maxLength));
							}
						}
					}
					else {
						names.push(svc.matrixName(comps[i].text, maxLength));
					}
				}
			}
		}
		return names;
	};
	svc.getMatrixOverallAverage = function (members, doRounding, currentSectionIdx) {
		var averageAll = 0.0;
		if (!Utility.empty(members)) {
			var total = 0;
			for (var i = 0; i < members.length; i++) {
				total += svc.getMatrixRowAverage(members[i], false, currentSectionIdx);
			}
			if (total > 0 && members.length > 0) {
				averageAll = total / members.length;
				if (doRounding) {
					averageAll = Math.round(averageAll);
				}
			}
		}
		return averageAll;
	};
	svc.getMatrixRowAverage = function (member, doRounding, currentSectionIdx) {
		var total = 0;
		var average = 0.0;
		var nItems = 0;
		if (!Utility.empty(member) && !Utility.empty(member.competencies)) {
			for (var i = 0; i < member.competencies.length; i++) {
				if (currentSectionIdx > svc.SECTION_SUMMARY) {
					if (i == currentSectionIdx || currentSectionIdx == svc.SECTION_ALL) {
						if (!Utility.empty(member.competencies[i]) && !Utility.empty(member.competencies[i].children)) {
							for (var j = 0; j < member.competencies[i].children.length; j++) {
								var comp = member.competencies[i].children[j];
								if (comp.val !== null && comp.val !== undefined) {
									nItems++;
									total += comp.val;
								}
							}
						}
					}
				}
				else {
					nItems++;
					total += member.competencies[i].val;
				}
			}
		}
		if (total > 0) {
			average = total / nItems;
			if (doRounding) {
				average = Math.round(average);
			}
		}
		return average;
	};
	svc.averagify = function (avgInfo, comp, doRounding) {
		if (Utility.empty(avgInfo.totals[comp.id])) {
			avgInfo.totals[comp.id] = 0;
			avgInfo.averages[comp.id] = 0;
			avgInfo.counts[comp.id] = 0;
		}
		avgInfo.totals[comp.id] += comp.val;
		avgInfo.counts[comp.id] += 1;
		if (comp.val > 0) {
			avgInfo.averages[comp.id] = avgInfo.totals[comp.id] / avgInfo.counts[comp.id];
			if (doRounding) {
				avgInfo.averages[comp.id] = Math.round(avgInfo.averages[comp.id]);
			}
		}
		return avgInfo;
	};
	svc.getMatrixColAverages = function (e, doRounding, currentSectionIdx) {
		var avgInfo = {averages: {}, totals: {}, counts: {}};
		if (!Utility.empty(e.members) && e.members.length > 0) {
			for (var z = 0; z < e.members.length; z++) {
				var comps = e.members[z].competencies;
				if (!Utility.empty(comps)) {
					for (var i = 0; i < comps.length; i++) {
						if (currentSectionIdx > svc.SECTION_SUMMARY) {
							if (i == currentSectionIdx || currentSectionIdx == svc.SECTION_ALL) {
								for (var j = 0; j < comps[i].children.length; j++) {
									avgInfo = svc.averagify(avgInfo, comps[i].children[j], doRounding);
								}
							}
						}
						else {
							avgInfo = svc.averagify(avgInfo, comps[i], doRounding);
						}
					}
				}
			}
		}
		return avgInfo.averages;
	};
});
