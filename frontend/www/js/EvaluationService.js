'use strict';

angular.module('app.evaluations', []).service('Evaluations', function ($resource, $filter, $http, $cookieStore, Utility, Instruments, Resources, Members) {
	var svc = this;

	svc.avg = 0.0;
	svc.avgRound = 0;
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

	svc.retrieve = function () {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			$resource('/api/evaluation/organization/' + user.organizationId, {}, {}).query().$promise.then(function (data) {
				svc.evaluations = data;
				for (var i = 0; i < svc.evaluations.length; i++) {
					svc.evaluations[i].member = Members.find(svc.evaluations[i].memberId);
				}
			});
		}
		return svc.evaluations;
	};

	svc.getMatrixData = function (instrumentId, isRollUp) {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			var url = '/api/evaluation/matrix/' + (!Utility.empty(isRollUp) ? 'rollup/' : '') + user.organizationId + '/' + instrumentId;
			$resource(url, {}, {}).query().$promise.then(function (data) {
				console.log("retrieved matrix data:", data);
				svc.matrix = data;
				svc.calcMatrixAverages();
			});
		}
		return svc.matrix;
	};

	svc.retrieve = function (evaluationId) {
		$resource('/api/evaluation/' + evaluationId, {}, {}).query().$promise.then(function (data) {
			svc.currentEval = data;
			if (!Utility.empty(svc.currentEval)) {
				svc.currentEval.instrument = svc.findInstrument(svc.currentEval.instrumentId);
				svc.currentEval.member = Members.find(svc.currentEval.memberId);
				console.log("EVAL SET MEMBER:", svc.currentEval.memberId, svc.currentEval.member);
				var sections = Instruments.findSections(svc.currentEval.instrumentId);
				for (var i = 0; i < svc.currentEval.responses.length; i++) {
					for (var j = 0; j < sections.length; j++) {
						for (var k = 0; k < sections[j].questions.length; k++) {
							var instrumentQuestionId = parseInt(sections[j].questions[k].id);
							var responseQuestionId = parseInt(currentEval.responses[i].questionId);
							if (instrumentQuestionId == responseQuestionId) {
								sections[j].questions[k].responseRecord = svc.currentEval.responses[i];
							}
						}
					}
				}
			}
		});
		return svc.currentEval;
	};

	svc.scorify = function (member) {
		svc.avg = 0;
		svc.avgRound = 0;
		var total = 0;
		var compCount = 0;
		var sections = Instruments.currSections();
		for (var i = 0; i < sections.length; i++) {
			var section = sections[i];
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
					recs.push({
								  resourceId: resource.id,
								  number: resource.number,
								  name: resource.name,
								  weight: scaledScore,
								  score: resource.score
							  });
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


	svc.matrixName = function (name, maxLength) {
		if (name.length > maxLength) {
			name = name.substr(0, maxLength) + '...';
		}
		return name;
	};

	svc.findMatrixResponseRowHeader = function (maxLength, currentSectionIdx) {
		var names = [];
		var sections = Instruments.findSections();
		if (Array.isArray(sections)) {
			for (var i = 0; i < sections.length; i++) {
				if (currentSectionIdx > Instruments.SECTION_SUMMARY) {
					if (i == currentSectionIdx || currentSectionIdx == Instruments.SECTION_ALL) {
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

	svc.findMatrixOrgRowValues = function (currentSectionIdx, allResponses) {
		var responses = [];
		var sections = Instruments.currSections();
		if (Array.isArray(sections) && Array.isArray(allResponses)) {
			var pos = 0;
			for (var i = 0; i < sections.length; i++) {
				if (currentSectionIdx > Instruments.SECTION_SUMMARY) {
					for (var j = 0; j < sections[i].questions.length; j++) {
						if (i == currentSectionIdx || currentSectionIdx == Instruments.SECTION_ALL) {
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
		var sections = Instruments.currSections();
		if (Array.isArray(sections)) {
			var pos = 0;
			for (var i = 0; i < sections.length; i++) {
				if (currentSectionIdx > Instruments.SECTION_SUMMARY) {
					for (var j = 0; j < sections[i].questions.length; j++) {
						if (i == currentSectionIdx || currentSectionIdx == Instruments.SECTION_ALL) {
							responses.push(allResponses[pos]);
						}
						pos++;
					}
				}
				else {
					responses.push(sections[i].avgRound);
				}
			}
		}
		return responses;
	};

	svc.findSectionIndex = function (responseIndex, sections) {
		var len = 0;
		for (var k = 0; k < sections.length; k++) {
			len += sections[k].questions.length;
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
			var sections = Instruments.currSections();
			var colTotals = [];
			var colNs = [];
			var sectionTotals = [];
			var sectionNs = [];
			for (var j = 0; j < svc.matrix[0].responses.length; j++) {
				colTotals[j] = 0;
				colNs[j] = 0;
			}
			for (j = 0; j < sections.length; j++) {
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
						var sectionIndex = svc.findSectionIndex(j, sections);
						sectionNs[j]++;
						sectionTotals[j] += response;
					}
				}
				svc.matrix[i].avg = (rowTotal > 0 && rowN > 0 ? Utility.round(rowTotal / rowN, 1) : 0);
				svc.matrix[i].avgRound = Math.round(svc.matrix[i].avg);
			}
			for (j = 0; j < sections.length; j++) {
				sections[j].avg = (sectionTotals[j] > 0 && sectionNs[j] > 0 ? Utility.round(sectionTotals[j] / sectionNs[j], 1) : 0);
				sections[j].avgRound = Math.round(sections[j].avg);
				sections[j].response = sections[j].avgRound;
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
