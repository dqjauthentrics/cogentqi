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
	svc.matrix = false;
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

	svc.getMatrixData = function (instrumentId) {
		console.log("getting matrix data:", instrumentId);
		svc.currentInstrumentId = null;
		svc.getSections(instrumentId);
		console.log("getting matrix data, sections done:", instrumentId);
		var user = $cookieStore.get('user');
		if (!Utility.empty(user) && !Utility.empty(instrumentId)) {
			svc.matrix = true;
			console.log("retrieving matrix data:", instrumentId);
			$http.get('/api/evaluation/matrix/' + user.organizationId + '/' + instrumentId).
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
		if (!Utility.empty(svc.instruments) && svc.instruments[0] != 'zz') {
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
			//score = (alignmentWeight * Math.pow((5 - memberScore), 2)) / nAlignments;
			score = (alignmentWeight * (5 - memberScore)) / nAlignments;
		}
		//console.log("RESOURCE SCORE: alignmentWeight=", alignmentWeight, ", memberScore=", memberScore, ", nAlignments=", nAlignments, ", => score: ", score);
		if (score > 5) {
			score = 5;
		}
		if (score < 0) {
			score = 0;
		}
		return score;
	};
	svc.recommend = function (sections) {
		try {
			Resources.initialize();
			if (!Utility.empty(sections) && sections[0] != 'zz' && !Utility.empty(Resources.resources) && Resources.resources[0] != 'zz') {
				svc.recommendations = [];
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
									Resources.resources[k].score += svc.resourceScore(alignment.weight, question.responseRecord.responseIndex, nAlignments)
								}
							}
						}
					}
				}
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
				svc.recommendations = svc.recommendations.sort(function (a, b) {
					return a["weight"] > b["weight"] ? -1 : a["weight"] < b["weight"] ? 1 : 0;
				});
			}
		}
		catch (exception) {
			console.log("EXCEPTION:", exception);
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
		if (!Utility.empty(svc.sections)) {
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
		if (svc.sections != undefined && svc.currentSectionIdx != undefined && svc.currentSectionIdx > 0) {
			return svc.sections[svc.currentSectionIdx].previous;
		}
		return null;
	};
	svc.sectionNextName = function () {
		if (svc.sections != undefined && svc.currentSectionIdx != undefined && svc.currentSectionIdx > 0) {
			return svc.sections[svc.currentSectionIdx].next;
		}
		return null;
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

	svc.matrixName = function (name, maxLength) {
		if (name.length > maxLength) {
			name = name.substr(0, maxLength) + '...';
		}
		return name;
	};
	svc.findMatrixResponseRowHeader = function (maxLength, currentSectionIdx) {
		var names = [];
		if (!Utility.empty(svc.sections) && svc.sections[0] != 'zz') {
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
	svc.findMatrixResponseRowValues = function (currentSectionIdx, allResponses) {
		var responses = [];
		if (!Utility.empty(svc.sections) && svc.sections[0] != 'zz') {
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
