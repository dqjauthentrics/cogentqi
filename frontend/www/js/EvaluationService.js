'use strict';

angular.module('app.evaluations', []).service('Evaluations', function ($filter, $http, $cookieStore, Utility, Resources, Members) {
	var svc = this;
	svc.SECTION_ALL = -100;
	svc.SECTION_SUMMARY = -101;

	svc.avg = 0.0;
	svc.avgRound = 0;
	svc.currentSectionIdx = 0;
	svc.initialized = false;
	svc.maxRange = 5;
	svc.instruments = false;
	svc.currentInstrumentId = null;
	svc.sections = false;
	svc.matrix = false;
	svc.evaluations = false;
	svc.currentEval = null;

	svc.recommendations = [
		{resourceId: null, number: null, name: null, weight: 0, score: 0},
		{resourceId: null, number: null, name: null, weight: 0, score: 0},
		{resourceId: null, number: null, name: null, weight: 0, score: 0},
		{resourceId: null, number: null, name: null, weight: 0, score: 0},
		{resourceId: null, number: null, name: null, weight: 0, score: 0},
		{resourceId: null, number: null, name: null, weight: 0, score: 0},
		{resourceId: null, number: null, name: null, weight: 0, score: 0},
		{resourceId: null, number: null, name: null, weight: 0, score: 0},
		{resourceId: null, number: null, name: null, weight: 0, score: 0},
		{resourceId: null, number: null, name: null, weight: 0, score: 0}
	];

	svc.memberEvaluations = function () {
		if (Array.isArray(svc.evaluations)) {
			for (var i = 0; i < svc.evaluations.length; i++) {
				svc.evaluations[i].member = Members.find(svc.evaluations[i].memberId);
			}
		}
		return svc.evaluations;
	};
	svc.loadEvaluations = function () {
		var user = $cookieStore.get('user');
		if (svc.evaluations === false && !Utility.empty(user)) {
			svc.evaluations = true;
			$http.get('/api/evaluation/organization/' + user.organizationId).
				success(function (data, status, headers, config) {
							svc.evaluations = data.result;
							svc.memberEvaluations();
						}).
				error(function (data, status, headers, config) {
						  console.log("ERROR: unable to retrieve evaluations.");
					  });
		}
	};
	svc.initialize = function () {
		var user = $cookieStore.get('user');
		if (svc.instruments === false && !Utility.empty(user)) {
			svc.instruments = true;
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
	svc.getSections = function (instrumentId) {
		if (!Utility.empty(instrumentId) && Array.isArray(svc.instruments)) {
			console.log("finding sections for instrument id", instrumentId, ", svc.instruments=", svc.instruments);
			svc.currentInstrumentId = instrumentId;
			svc.sections = [];
			for (var i = 0; i < svc.instruments.length; i++) {
				if (svc.instruments[i].id == instrumentId) {
					console.log("found instrument id", instrumentId);
					var instrument = svc.instruments[i];
					var groups = instrument.questionGroups;
					var gLen = instrument.questionGroups.length;
					console.log("found ", gLen, " groups for instrument id", instrumentId);
					for (var j = 0; j < gLen; j++) {
						var questionGroup = groups[j];
						var previous = (j > 0 ? groups[(j - 1)].tag : groups[(groups.length - 1)].tag);
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

	svc.getMatrixData = function (instrumentId, isRollUp) {
		console.log("getting matrix data:", instrumentId);
		svc.currentInstrumentId = null;
		svc.getSections(instrumentId);
		console.log("getting matrix data, sections done:", svc.sections);
		var user = $cookieStore.get('user');
		if (!Utility.empty(user) && instrumentId !== false) {
			svc.matrix = true;
			console.log("retrieving matrix data:", instrumentId);
			var url = '/api/evaluation/matrix/';
			if (!Utility.empty(isRollUp)) {
				url += 'rollup/';
			}
			url += user.organizationId + '/' + instrumentId;
			$http.get(url).
				success(function (data, status, headers, config) {
							console.log("retrieved matrix data:", data);
							svc.matrix = data.result;
							svc.getSections(instrumentId);
							svc.calcMatrixAverages();
						}).
				error(function (data, status, headers, config) {
						  console.log("ERROR: unable to retrieve matrix data.");
					  });
		}
	};

	svc.findInstrument = function (instrumentId) {
		if (instrumentId == null) {
			instrumentId = 1;
			svc.currentInstrumentId = instrumentId;
		}
		if (!Utility.empty(svc.instruments)) {
			for (var i = 0; i < svc.instruments.length; i++) {
				if (svc.instruments[i].id == instrumentId) {
					return svc.instruments[i];
				}
			}
		}
		return null;
	};
	svc.findQuestion = function (questionId) {
		if (svc.instruments !== false && Array.isArray(svc.instruments)) {
			for (var i = 0; i < svc.instruments.length; i++) {
				for (var j = 0; j < svc.instruments[i].questions.length; j++) {
					if (svc.instruments[i].questions[j].id == questionId) {
						return svc.instruments[i].questions[j];
					}
				}
			}
		}
		return null;
	};

	svc.retrieve = function (evaluationId) {
		$http.get('/api/evaluation/' + evaluationId).
			success(function (data, status, headers, config) {
						svc.currentEval = data.result;
						if (!Utility.empty(svc.currentEval)) {
							svc.currentEval.instrument = svc.findInstrument(svc.currentEval.instrumentId);
							svc.currentEval.member = Members.find(svc.currentEval.memberId);
							//console.log("MEMBER SET:", svc.currentEval.memberId, svc.currentEval.member);
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
	svc.resourceScore = function (instrument, alignmentWeight, memberScore, nAlignments) {
		var score = 0;
		if (memberScore > 0 && nAlignments > 0) {
			score = (alignmentWeight * ((instrument.maxRange + 1) - memberScore)) / nAlignments;
		}
		//console.log("RESOURCE SCORE: max=", instrument.maxRange, ", alignmentWeight=", alignmentWeight, ", memberScore=", memberScore, ", nAlignments=", nAlignments, ", => score: ", score);
		return score;
	};
	svc.scale = function (score, minRaw, maxRaw, scaleMin, scaleMax) {
		return Math.round(((score - minRaw) / (maxRaw - minRaw) ) * (scaleMax - scaleMin) + 1);
	};
	svc.recommend = function (sections) {
		var instrument = svc.findInstrument(svc.currentInstrumentId);
		Resources.initialize();
		if (sections !== false && Array.isArray(sections) && Array.isArray(Resources.resources)) {
			for (k = 0; k < Resources.resources.length; k++) {
				Resources.resources[k].score = 0;
				Resources.resources[k].nAlignments = 0;
			}
			var minScore = null;
			var maxScore = null;
			var nTotalAlignments = 0;
			for (var i = 0; i < sections.length; i++) {
				for (var j = 0; j < sections[i].questions.length; j++) {
					var question = sections[i].questions[j];
					for (var k = 0; k < Resources.resources.length; k++) {
						var resource = Resources.resources[k];
						var nAlignments = resource.alignments.length;
						for (var z = 0; z < nAlignments; z++) {
							var alignment = resource.alignments[z];
							var resQuestionId = parseInt(alignment.questionId);
							var questionId = parseInt(question.id);
							if (resQuestionId == questionId) {
								Resources.resources[k].score += svc.resourceScore(instrument, alignment.weight, question.responseRecord.responseIndex, nAlignments);
								Resources.resources[k].nAlignments++;
								nTotalAlignments++;
								if (maxScore === null || Resources.resources[k].score > maxScore) {
									maxScore = Resources.resources[k].score;
								}
								else if (minScore === null || Resources.resources[k].score < minScore && Resources.resources[k].score > 0) {
									minScore = Resources.resources[k].score;
								}
							}
						}
					}
				}
			}
			var recCnt = 0;
			var recs = [];
			for (k = 0; k < Resources.resources.length; k++) {
				resource = Resources.resources[k];
				var scaledScore = svc.scale(resource.score, minScore, maxScore, 0, instrument.maxRange);
				//console.log("REC: min=", minScore, ", max=", maxScore, ",nTotalAlignments=", nTotalAlignments, ", score=", resource.score, ", scaled=", scaledScore, ", n=", resource.nAlignments);
				if (scaledScore > instrument.maxRange) {
					scaledScore = instrument.maxRange;
				}
				if (scaledScore < 0) {
					scaledScore = 0;
				}
				if (resource.score > 0 && recCnt < 10) {
					recs.push({resourceId: resource.id, number: resource.number, name: resource.name, weight: scaledScore, score: resource.score});
					recCnt++;
				}
			}
			recs = recs.sort(function (a, b) {
				return a["score"] > b["score"] ? -1 : a["score"] < b["score"] ? 1 : 0;
			});
			for (var zz = 0; zz < 10; zz++) {
				if (zz < recs.length) {
					var rec = recs[zz];
					svc.recommendations[zz].resourceId = rec.resourceId;
					svc.recommendations[zz].number = rec.number;
					svc.recommendations[zz].name = rec.name;
					svc.recommendations[zz].weight = rec.weight;
					svc.recommendations[zz].score = rec.score;
				}
				else {
					svc.recommendations[zz].resourceId = null;
					svc.recommendations[zz].number = null;
					svc.recommendations[zz].name = null;
					svc.recommendations[zz].weight = 0;
					svc.recommendations[zz].score = 0;
				}
			}
			//console.log("RECOMMENDATIONS:", svc.recommendations);
		}
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
		if (!Utility.empty(svc.sections)) {
			if (svc.currentSectionIdx == svc.SECTION_ALL) {
				return 'Section Summary';
			}
			if (svc.currentSectionIdx >= 0 && svc.currentSectionIdx < svc.sections.length) {
				name = svc.sections[svc.currentSectionIdx].name;
			}
		}
		return name;
	};
	svc.sectionPreviousName = function () {
		if (Array.isArray(svc.sections)) {
			if (svc.currentSectionIdx >= 0) {
				return svc.sections[svc.currentSectionIdx].previous;
			}
			else {
				return svc.sections[0].previous;
			}
		}
		return null;
	};
	svc.sectionNextName = function () {
		if (Array.isArray(svc.sections)) {
			if (svc.currentSectionIdx >= 0) {
				return svc.sections[svc.currentSectionIdx].next;
			}
			else {
				return svc.sections[(svc.sections.length - 1)].next;
			}
		}
		return null;
	};
	svc.sectionNext = function () {
		svc.currentSectionIdx = 0;
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
		svc.currentSectionIdx = 0;
		if (svc.currentSectionIdx > 0) {
			svc.currentSectionIdx--;
		}
		else {
			if (Array.isArray(svc.sections)) {
				svc.currentSectionIdx = svc.sections.length - 1;
			}
		}
	};
	svc.sectionIsFirst = function () {
		return svc.currentSectionIdx <= 0;
	};
	svc.sectionIsLast = function () {
		if (Array.isArray(svc.sections)) {
			return svc.currentSectionIdx >= svc.sections.length - 1;
		}
		return false;
	};

	svc.matrixName = function (name, maxLength) {
		if (name.length > maxLength) {
			name = name.substr(0, maxLength) + '...';
		}
		return name;
	};
	svc.findMatrixResponseRowHeader = function (maxLength, currentSectionIdx) {
		var names = [];
		if (Array.isArray(svc.sections)) {
			for (var i = 0; i < svc.sections.length; i++) {
				if (currentSectionIdx > svc.SECTION_SUMMARY) {
					if (i == currentSectionIdx || currentSectionIdx == svc.SECTION_ALL) {
						for (var j = 0; j < svc.sections[i].questions.length; j++) {
							names.push(svc.matrixName(svc.sections[i].questions[j].name, maxLength));
						}
					}
				}
				else {
					names.push(svc.matrixName(svc.sections[i].name, maxLength));
				}
			}
		}
		return names;
	};
	svc.findMatrixOrgRowValues = function (currentSectionIdx, allResponses) {
		var responses = [];
		if (Array.isArray(svc.sections)) {
			var pos = 0;
			for (var i = 0; i < svc.sections.length; i++) {
				if (currentSectionIdx > svc.SECTION_SUMMARY) {
					for (var j = 0; j < svc.sections[i].questions.length; j++) {
						if (i == currentSectionIdx || currentSectionIdx == svc.SECTION_ALL) {
							responses.push(allResponses[pos]);
						}
						pos++;
					}
				}
				else {
					responses.push(Utility.randomIntBetween(1, 4));
				}
			}
		}
		return responses;
	};
	svc.findMatrixResponseRowValues = function (currentSectionIdx, allResponses) {
		var responses = [];
		if (Array.isArray(svc.sections)) {
			var pos = 0;
			for (var i = 0; i < svc.sections.length; i++) {
				if (currentSectionIdx > svc.SECTION_SUMMARY) {
					for (var j = 0; j < svc.sections[i].questions.length; j++) {
						if (i == currentSectionIdx || currentSectionIdx == svc.SECTION_ALL) {
							responses.push(allResponses[pos]);
						}
						pos++;
					}
				}
				else {
					responses.push(svc.sections[i].avgRound);
				}
			}
		}
		return responses;
	};
	svc.findSectionIndex = function (responseIndex) {
		var len = 0;
		for (var k = 0; k < svc.sections.length; k++) {
			len += svc.sections[k].questions.length;
			if (responseIndex < len) {
				return k;
			}
		}
		return 0;
	};
	svc.calcMatrixAverages = function () {
		var total = 0;
		var average = 0.0;
		var nItems = 0;
		if (!Utility.empty(svc.matrix)) {
			var colTotals = [];
			var colNs = [];
			var sectionTotals = [];
			var sectionNs = [];
			for (var j = 0; j < svc.matrix[0].responses.length; j++) {
				colTotals[j] = 0;
				colNs[j] = 0;
			}
			for (j = 0; j < svc.sections.length; j++) {
				sectionTotals[j] = 0;
				sectionNs[j] = 0;
			}
			for (var i = 0; i < svc.matrix.length; i++) {
				var rowTotal = 0;
				var rowN = 0;
				for (j = 0; j < svc.matrix[i].responses.length; j++) {
					var response = parseInt(svc.matrix[i].responses[j]);
					if (response > 0) {
						rowN++;
						rowTotal += response;
						colNs[j]++;
						colTotals[j] += response;
						var sectionIndex = svc.findSectionIndex(j);
						sectionNs[j]++;
						sectionTotals[j] += response;
					}
				}
				svc.matrix[i].avg = (rowTotal > 0 && rowN > 0 ? Utility.round(rowTotal / rowN, 1) : 0);
				svc.matrix[i].avgRound = Math.round(svc.matrix[i].avg);
			}
			for (j = 0; j < svc.sections.length; j++) {
				svc.sections[j].avg = (sectionTotals[j] > 0 && sectionNs[j] > 0 ? Utility.round(sectionTotals[j] / sectionNs[j], 1) : 0);
				svc.sections[j].avgRound = Math.round(svc.sections[j].avg);
				svc.sections[j].response = svc.sections[j].avgRound;
			}
			var mLen = svc.matrix.length;
			svc.matrix[mLen] = {memberId: -1, responses: [], colAvgs: []};
			svc.matrixAvg = 0.0;
			total = 0;
			nItems = 0;
			for (j = 0; j < colTotals.length; j++) {
				var avg = (colTotals[j] > 0 && colNs[j] > 0 ? Utility.round(colTotals[j] / colNs[j], 1) : 0);
				var avgRound = Math.round(avg);
				svc.matrix[mLen].responses[j] = avg;
				svc.matrix[mLen].colAvgs[j] = {avg: avg, avgRound: avgRound};
				if (avg > 0) {
					total += avg;
					nItems++;
				}
			}
			svc.matrix[mLen].avg = (total > 0 && nItems > 0 ? Utility.round(total / nItems, 1) : 0);
			svc.matrix[mLen].avgRound = Math.round(svc.matrix[mLen].avg);
		}
	};
});
