/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Assessments', []).service(
	'Assessments',
	function ($rootScope, $resource, $filter, $http, $cookieStore, Utility, Instruments, Resources, Members) {
		var svc = this;
		svc.nRankings = 5;
		svc.list = null;
		svc.current = null;
		svc.matrix = null;

		svc.retrieve = function () {
			var user = $cookieStore.get('user');
			if (!svc.loading && !Utility.empty(user)) {
				console.log("retrieving assessments");
				return $resource('/api3/assessment/byOrganization/' + user.oi, {}, {query: {method: 'GET', isArray: false, cache: false}});
			}
			return null;
		};
		svc.save = function (assessment, memberId, callbackFn) {
			var user = $cookieStore.get('user');
			if (!Utility.empty(user)) {
				$http.post('/api3/assessment/update/' + memberId + '/' + user.id, {assessment: assessment})
					.then(function (data, status, headers, config) {
							  callbackFn(data);
						  },
						  function (data, status, headers, config) {
							  callbackFn(0, data);
						  });
			}
			return null;
		};
		svc.lock = function (assessmentId, newState) {
			var user = $cookieStore.get('user');
			if (!Utility.empty(user)) {
				return $resource('/api3/assessment/lock/' + user.id + '/' + assessmentId + '/' + newState, {},
								 {query: {method: 'GET', isArray: false, cache: false}});
			}
			return null;
		};
		svc.retrieveSingle = function (assessmentId) {
			if (!Utility.empty(assessmentId)) {
				return $resource('/api3/assessment/get/' + assessmentId, {}, {query: {method: 'GET', isArray: false, cache: false}});
			}
			return null;
		};
		svc.create = function (memberId, callbackFn) {
			var user = $cookieStore.get('user');
			if (!Utility.empty(user)) {
				$http.post("/api3/assessment/create", {memberId: memberId, assessorId: user.id})
					.then(function (data, status, headers, config) {
							  callbackFn(data);
						  },
						  function (data, status, headers, config) {
							  callbackFn(data);
						  });
			}
			return null;
		};
		svc.remove = function (assessmentId, callbackFn) {
			$http.post("/api3/assessment/delete", {id: assessmentId})
				.then(function (data, status, headers, config) {
						  callbackFn(data);
					  },
					  function (data, status, headers, config) {
						  callbackFn(data);
					  });
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
				return $resource('/api3/assessment/byMember/' + memberId, {}, {query: {method: 'GET', isArray: false, cache: false}});
			}
			return null;
		};

		svc.retrieveMatrix = function (instrumentId, organizationId, isRollUp) {
			var orgId = organizationId;
			if (Utility.empty(orgId)) {
				var user = $cookieStore.get('user');
				if (!Utility.empty(user.oi)) {
					orgId = user.oi;
				}
			}
			if (!Utility.empty(instrumentId) && !Utility.empty(orgId)) {
				var res = $resource('/api3/assessment/matrix/' + orgId + '/' + instrumentId, {}, {query: {method: 'GET', isArray: false, cache: false}});
				if (res) {
					res.query(function(response) {
						svc.matrix = response.data;
						console.log("ass:", svc.matrix);
					});
				}
			}
			return null;
		};

		svc.retrieveProgressByMonth = function (instrumentId, isRollUp) {
			var user = $cookieStore.get('user');
			if (!Utility.empty(instrumentId) && !Utility.empty(user) && !Utility.empty(user.oi)) {
				return $resource('/api3/assessment/organizationProgressByMonth' + user.oi + '/' + instrumentId,
								 {}, {query: {method: 'GET', isArray: false, cache: false}});
			}
			return null;
		};
		svc.retrieveIndividualProgressByMonth = function (memberId) {
			if (!Utility.empty(memberId)) {
				return $resource('/api3/assessment/memberProgressByMonth/' + memberId, {}, {query: {method: 'GET', isArray: false, cache: false}});
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

		svc.scorify = function (instrument, responses) {
			var avg = 0;
			var avgRound = 0;
			var total = 0;
			var compCount = 0;
			if (!Utility.empty(instrument) && !Utility.empty(instrument.sections)) {
				var sections = instrument.sections;
				for (var i = 0; i < sections.length; i++) {
					var section = sections[i];
					for (var j = 0; j < section.questions.length; j++) {
						var question = section.questions[i];
						var responseValue = !Utility.empty(responses[question.id]) ? responses[question.id].rdx : 0;
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
			//console.log("scorify:", total, avg, avgRound);
			return {avg: avg, avgRound: avgRound};
		};

		svc.scoreWord = function (question, score, responses) {
			var scoreWord = null;
			try {
				score = parseInt(Math.round(score));
				if (!Utility.empty(score)) {
					scoreWord = responses[question.id].ch[score].n;
				}
				if (Utility.empty(scoreWord)) {
					scoreWord = "N/A";
					switch (score) {
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

		svc.resourceScore = function (instrument, alignmentWeight, response, nAlignments) {
			var score = 0;
			var memberScore = response.rdx;
			if (!Utility.empty(instrument) && !Utility.empty(instrument.max) && memberScore > 0 && nAlignments > 0) {
				var range = instrument.max - instrument.min;
				if (true) {
					if (response.ow > 0 && response.of > 0) {
						memberScore -= (response.ow * response.of);
					}
					if (response.ew > 0 && response.ef > 0) {
						memberScore -= (response.ew * response.ef);
					}
				}
				score = (alignmentWeight * Math.pow((range - memberScore), 2));
			}
			return score;
		};

		svc.scale = function (score, minRaw, maxRaw, scaleMin, nRankings) {
			var rawDiff = (score - scaleMin);
			var maxDiff = (maxRaw - scaleMin);
			var scaledScore = 0;
			if (score > 0) {
				if (score >= maxRaw) {
					scaledScore = nRankings;
				}
				else if (rawDiff > 0) {
					//console.log("        rawDiff=" + rawDiff + ", maxDiff=" + maxDiff);
					scaledScore = Math.round((rawDiff / maxDiff) * nRankings);
				}
				//console.log("    SCALED: scaled=" + scaledScore + ", score=" + score + ", minRaw=" + minRaw + ", maxRaw=" + maxRaw + ", scaleMin=" + scaleMin);
			}
			if (scaledScore > svc.nRankings) {
				scaledScore = svc.nRankings;
			}
			if (scaledScore < 0) {
				scaledScore = 0;
			}
			return scaledScore;
		};

		svc.recommend = function (instrument, resources, responses) {
			var recSubset = [];
			if (!Utility.empty(instrument) && Array.isArray(instrument.sections) && Array.isArray(resources)) {
				for (k = 0; k < resources.length; k++) {
					resources[k].sc = 0;
					resources[k].nAlignments = 0;
				}
				var minScore = null;
				var maxScore = null;
				var nTotalAlignments = 0;
				for (var i = 0; i < instrument.sections.length; i++) {
					for (var j = 0; j < instrument.sections[i].questions.length; j++) {
						var question = instrument.sections[i].questions[j];
						if (Utility.empty(responses[question.id])) {
							return [];
						}
						else {
							for (var k = 0; k < resources.length; k++) {
								var resource = resources[k];
								var nAlignments = resource.alignments.length;
								for (var z = 0; z < nAlignments; z++) {
									var alignment = resource.alignments[z];
									var resQuestionId = parseInt(alignment.qi);
									var questionId = parseInt(question.id);
									if (resQuestionId == questionId) {
										resources[k].sc += svc.resourceScore(instrument, alignment.wt, responses[question.id], nAlignments);
										resources[k].nAlignments++;
										nTotalAlignments++;
										if (maxScore === null || resources[k].sc > maxScore) {
											maxScore = resources[k].sc;
										}
										else if (minScore === null || (resources[k].sc < minScore && resources[k].sc > 0)) {
											minScore = resources[k].sc;
										}
									}
								}
							}
						}
					}
				}
				var recCnt = 0;
				var recs = [];
				for (k = 0; k < resources.length; k++) {
					resource = resources[k];
					if (resource.sc > 0) {
						var scaledScore = svc.scale(resource.sc, minScore, maxScore, instrument.min, svc.nRankings);
						//console.log("RES:" + resource.name + ", raw=" + resource.sc + ", scaled => " + scaledScore);
						//console.log("REC: min=", minScore, ", max=", maxScore, ",nTotalAlignments=", nTotalAlignments, ", score=", resource.sc, ", scaled=",
						//			scaledScore, ", n=", resource.nAlignments);
						recs.push({
									  id: resource.id,
									  nmb: resource.nmb,
									  n: resource.n,
									  wt: scaledScore,
									  sc: resource.sc
								  });
						recCnt++;
					}
				}
				recs = recs.sort(function (a, b) {
					return a.sc > b.sc ? -1 : a.sc < b.sc ? 1 : 0;
				});
				for (var zz = 0; (zz < 10 && zz < recs.length); zz++) {
					recSubset.push(recs[zz]);
				}
			}
			return recSubset;
		};

		svc.sliderChange = function (question, instrument, responses) {
			var scoreWord = null;
			var avg = 0;
			var avgRound = 0;
			if (!Utility.empty(question) && !Utility.empty(responses[question.id])) {
				var slider = $("#question_item_" + question.id);
				slider.removeClass(function (index, css) {
					return (css.match(/(^|\s)slider\S+/g) || []).join(' ');
				}).addClass("slider" + responses[question.id].rdx);
				var score = svc.scorify(instrument);
				avg = score.avg;
				avgRound = score.avgRound;
				var rubricBox = $("#rubric_" + question.id + "_" + avgRound);
				var pos = rubricBox.position();
				var pointer = slider.find(".pointer");
				pointer.css({left: 100});
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
								responses.push({r: allResponses[pos], t: sections[i].questions[j].typeName});
							}
							pos++;
						}
					}
					else {
						responses.push({r: sections[i].avgRound, t: sections[i].questions[0].typeName});
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
					matrix[i].typeName = null;
					for (j = 0; j < matrix[i].responses.length; j++) {
						var response = parseInt(matrix[i].responses[j][0]);
						if (matrix[i].typeName == null) {
							matrix[i].typeName = matrix[i].responses[j][1];
						}
						else if (matrix[i].typeName !== 'MIXED' && matrix[i].typeName !== matrix[i].responses[j][1]) {
							matrix[i].typeName = 'MIXED';
						}
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
					matrix[mLen].responses[j] = [avg, 'LIKERT'];
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
	})
;
