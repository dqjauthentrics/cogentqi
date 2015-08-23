'use strict';

angular.module('Assessments', []).service('Assessments', function ($resource, $filter, $http, $cookieStore, Utility, Instruments, Resources, Members) {
	var svc = this;

	svc.retrieve = function () {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			return $resource('/api/assessment/organization/' + user.organizationId, {}, {cache: false});
		}
		return null;
	};
	svc.retrieveSingle = function (assessmentId) {
		if (!Utility.empty(assessmentId)) {
			return $resource('/api/assessment/' + assessmentId, {}, {query: {method: 'GET', isArray: false}});
		}
		return null;
	};
	svc.create = function (assessorId, memberId, instrumentId) {
		if (!Utility.empty(assessorId) && !Utility.empty(memberId) && !Utility.empty(instrumentId)) {
			return $resource('/api/assessment/new/' + assessorId + '/' + memberId + '/' + instrumentId, {}, {query: {method: 'GET', isArray: false}});
		}
		return null;
	};

	svc.associateMembers = function (assessments, members) {
		if (!Utility.empty(assessments) && !Utility.empty(members)) {
			for (var i = 0; i < assessments.length; i++) {
				assessments[i].member = Utility.findObjectById(members, assessments[i].memberId);
				assessments[i].byMember = Utility.findObjectById(members, assessments[i].byMemberId);
			}
		}
	};
	svc.retrieveForMember = function (memberId) {
		if (!Utility.empty(memberId)) {
			return $resource('/api/assessment/member/' + memberId, {}, {});
		}
		return null;
	};

	svc.retrieveMatrix = function (instrumentId, organizationId, isRollUp) {
		console.log("retriever: ", instrumentId, organizationId);
		var orgId = organizationId;
		if (Utility.empty(orgId)) {
			var user = $cookieStore.get('user');
			if (!Utility.empty(user.organizationId)) {
				orgId = user.organizationId;
			}
		}
		if (!Utility.empty(instrumentId) && !Utility.empty(orgId)) {
			console.log("retriever call: ", instrumentId, organizationId);
			return $resource('/api/assessment/matrix/' + (isRollUp ? 'rollup/' : '') + orgId + '/' + instrumentId, {}, {});
		}
		return null;
	};

	svc.retrieveProgressByMonth = function (instrumentId, isRollUp) {
		var user = $cookieStore.get('user');
		if (!Utility.empty(instrumentId) && !Utility.empty(user) && !Utility.empty(user.organizationId)) {
			return $resource('/api/assessment/progressbymonth/' + (isRollUp ? 'rollup/' : '') + user.organizationId + '/' + instrumentId, {},
				{query: {method: 'GET', isArray: false}});
		}
		return null;
	};
	svc.retrieveIndividualProgressByMonth = function (memberId) {
		if (!Utility.empty(memberId)) {
			return $resource('/api/assessment/progressbymonth/single/' + memberId, {}, {query: {method: 'GET', isArray: false}});
		}
		return null;
	};

	svc.findQuestion = function (questionId, questions) {
		for (var i = 0; i < questions.length; i++) {
			if (questions[i].qi == questionId) {
				return questions[i];
			}
		}
		return null;
	};

	svc.scorify = function (question, instrument) {
		var avg = 0;
		var avgRound = 0;
		var total = 0;
		var compCount = 0;
		if (!Utility.empty(instrument) && !Utility.empty(instrument.sections)) {
			var sections = instrument.sections;
			for (var i = 0; i < sections.length; i++) {
				var section = sections[i];
				for (var j = 0; j < section.questions.length; j++) {
					var responseValue = !Utility.empty(section.questions[j].rsp) ? section.questions[j].rsp.ri : 0;
					if (responseValue > 0) {
						total += responseValue;
						compCount++;
					}
				}
			}
			if (total > 0) {
				avg = $filter('number')(total / compCount, 1);
				avgRound = Math.round(avg);
			}
		}
		return {avg: avg, avgRound: avgRound};
	};

	svc.scoreWord = function (question) {
		var scoreWord = null;
		try {
			var score = question.rsp.ri;
			if (!Utility.empty(question.rsp.ch)) {
				scoreWord = question.rsp.ch[question.rsp.ri].n;
			}
			if (Utility.empty(scoreWord)) {
				scoreWord = "N/A";
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
					case 6:
						scoreWord = "WHat";
						break;
					default:
				}
			}
		}
		catch (exception) {
		}
		return scoreWord;
	};

	svc.resourceScore = function (instrument, alignmentWeight, memberScore, nAlignments) {
		var score = 0;
		if (!Utility.empty(instrument) && memberScore > 0 && nAlignments > 0) {
			score = (alignmentWeight * ((instrument.max + 1) - memberScore)) / nAlignments;
		}
		//console.log("RESOURCE SCORE: max=", instrument.maxRange, ", alignmentWeight=", alignmentWeight, ", memberScore=", memberScore, ", nAlignments=", nAlignments, ", => score: ", score);
		return score;
	};

	svc.scale = function (score, minRaw, maxRaw, scaleMin, scaleMax) {
		return Math.round(((score - minRaw) / (maxRaw - minRaw) ) * (scaleMax - scaleMin) + 1);
	};

	svc.recommend = function (instrument, resources) {
		var recs = [];
		if (!Utility.empty(instrument) && Array.isArray(instrument.sections) && Array.isArray(resources)) {
			for (k = 0; k < resources.length; k++) {
				resources[k].score = 0;
				resources[k].nAlignments = 0;
			}
			var minScore = null;
			var maxScore = null;
			var nTotalAlignments = 0;
			for (var i = 0; i < instrument.sections.length; i++) {
				for (var j = 0; j < instrument.sections[i].questions.length; j++) {
					var question = instrument.sections[i].questions[j];
					if (Utility.empty(question.rsp)) {
						return [];
					}
					else {
						for (var k = 0; k < resources.length; k++) {
							var resource = resources[k];
							var nAlignments = resource.alignments.length;
							for (var z = 0; z < nAlignments; z++) {
								var alignment = resource.alignments[z];
								var resQuestionId = parseInt(alignment.questionId);
								var questionId = parseInt(question.id);
								if (resQuestionId == questionId) {
									resources[k].score += svc.resourceScore(instrument, alignment.weight, question.rsp.ri, nAlignments);
									resources[k].nAlignments++;
									nTotalAlignments++;
									if (maxScore === null || resources[k].score > maxScore) {
										maxScore = resources[k].score;
									}
									else if (minScore === null || resources[k].score < minScore && resources[k].sc > 0) {
										minScore = resources[k].score;
									}
								}
							}
						}
					}
				}
			}
			var recCnt = 0;
			for (k = 0; k < resources.length; k++) {
				resource = resources[k];
				var scaledScore = svc.scale(resource.score, minScore, maxScore, 0, instrument.max);
				//console.log("REC: min=", minScore, ", max=", maxScore, ",nTotalAlignments=", nTotalAlignments, ", score=", resource.score, ", scaled=",
				//			scaledScore, ", n=", resource.nAlignments);
				if (scaledScore > instrument.max) {
					scaledScore = instrument.max;
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
		}
		return recs;
	};

	svc.sliderChange = function (question, instrument) {
		var scoreWord = null;
		var avg = 0;
		var avgRound = 0;
		if (!Utility.empty(question) && !Utility.empty(question.rsp)) {
			//scoreWord = svc.scoreWord(question);
			var slider = $("#question_item_" + question.id);
			//var levelEl = slider.find("span.bubble.low");
			//levelEl.html(scoreWord);
			slider.removeClass(function (index, css) {
				return (css.match(/(^|\s)slider\S+/g) || []).join(' ');
			}).addClass("slider" + question.rsp.ri);
			var score = svc.scorify(question, instrument);
			avg = score.avg;
			avgRound = score.avgRound;
		}
		return {avg: avg, avgRound: avgRound};
	};

	svc.findMatrixResponseRowValues = function (instrument, currentSectionIdx, allResponses) {
		var responses = [];
		if (!Utility.empty(instrument) && !Utility.empty(currentSectionIdx) && Array.isArray(instrument.sections)) {
			var sections = instrument.sections;
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

	svc.calcMatrixAverages = function (instrument, matrix, isRollup) {
		var total = 0;
		var average = 0.0;
		var nItems = 0;
		if (!Utility.empty(instrument) && !Utility.empty(instrument.sections) && !Utility.empty(matrix)) {
			var sections = instrument.sections;
			var colTotals = [];
			var colNs = [];
			var sectionTotals = [];
			var sectionNs = [];
			for (var j = 0; j < matrix[0].responses.length; j++) {
				colTotals[j] = 0;
				colNs[j] = 0;
			}
			for (j = 0; j < sections.length; j++) {
				sectionTotals[j] = 0;
				sectionNs[j] = 0;
			}
			for (var i = 0; i < matrix.length; i++) {
				var rowTotal = 0;
				var rowN = 0;
				for (j = 0; j < matrix[i].responses.length; j++) {
					var response = parseInt(matrix[i].responses[j]);
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
				matrix[i].avg = (rowTotal > 0 && rowN > 0 ? Utility.round(rowTotal / rowN, 1) : 0);
				matrix[i].avgRound = Math.round(matrix[i].avg);
			}
			for (j = 0; j < sections.length; j++) {
				sections[j].avg = (sectionTotals[j] > 0 && sectionNs[j] > 0 ? Utility.round(sectionTotals[j] / sectionNs[j], 1) : 0);
				sections[j].avgRound = Math.round(sections[j].avg);
				sections[j].response = sections[j].avgRound;
			}
			var mLen = matrix.length;
			if (isRollup) {
				matrix[mLen] = {name: 'Averages', organizationId: -1, responses: [], colAvgs: []};
			}
			else {
				matrix[mLen] = {name: 'Averages', memberId: -1, responses: [], colAvgs: []};
			}
			var matrixAvg = 0.0;
			total = 0;
			nItems = 0;
			for (j = 0; j < colTotals.length; j++) {
				var avg = (colTotals[j] > 0 && colNs[j] > 0 ? Utility.round(colTotals[j] / colNs[j], 1) : 0);
				var avgRound = Math.round(avg);
				matrix[mLen].responses[j] = avg;
				matrix[mLen].colAvgs[j] = {avg: avg, avgRound: avgRound};
				if (avg > 0) {
					total += avg;
					nItems++;
				}
			}
			matrix[mLen].avg = (total > 0 && nItems > 0 ? Utility.round(total / nItems, 1) : 0);
			matrix[mLen].avgRound = Math.round(matrix[mLen].avg);
		}
	};
});
