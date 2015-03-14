'use strict';

angular.module('app.assessments', ['app.utils', 'app.resources']).service('Assessments', function ($filter, $rootScope, angularLoad, Utility, Resources) {
    var svc = this;
    svc.avg = 0.0;
    svc.avgRound = 0;
    svc.currentSectionIdx = 0;
    svc.initialized = false;
    svc.maxRange = 5;
    svc.competencies = [];
    svc.recommendations = [];
    svc.assessments = [];
    svc.SECTION_ALL = -100;
    svc.SECTION_SUMMARY = -101;

    /**
     * NB: Assumes members have been loaded.
     * @param callback
     */
    svc.load = function (callback) {
        if (Utility.empty(svc.competencies) && !Utility.empty($rootScope.installation) && !Utility.empty($rootScope.installation.subdomain)) {
            angularLoad.loadScript('js/config/' + $rootScope.installation.subdomain + '/framework.js').then(function () {
                svc.competencies = competencies;
                for (var i = 0; i < svc.competencies.length; i++) {
                    svc.competencies[i].previous = '';
                    svc.competencies[i].next = '';
                    if (i > 0) {
                        svc.competencies[i].previous = svc.competencies[(i - 1)].text;
                    }
                    if (i < svc.competencies.length - 1) {
                        svc.competencies[i].next = svc.competencies[(i + 1)].text;
                    }
                }
                angularLoad.loadScript('js/config/' + $rootScope.installation.subdomain + '/assessments.js').then(function () {
                    svc.assessments = assessments;
                    callback();
                }).catch(function () {
                    console.log("ERROR: Unable to load assessments.")
                });
            }).catch(function () {
                console.log("ERROR: Unable to load competency framework.")
            });
        }
        else {
            callback();
        }
    };

    svc.get = function (assessmentId) {
        if (!Utility.empty(svc.assessments)) {
            for (var i = 0; i < svc.assessments.length; i++) {
                if (svc.assessments[i].id === parseInt(assessmentId)) {
                    return svc.assessments[i];
                }
            }
        }
        return null;
    };
    /**
     * @todo Gets first matching, at the moment.
     */
    svc.getMostRecent = function (memberId) {
        for (var i = 0; i < assessments.length; i++) {
            if (svc.assessments[i].memberId === parseInt(memberId)) {
                return svc.assessments[i];
            }
        }
        return null;
    };
    svc.scorify = function (member) {
        svc.avg = 0;
        var total = 0;
        var compCount = 0;
        if (!Utility.empty(member) && !Utility.empty(member.competencies)) {
            for (var i = 0; i < member.competencies.length; i++) {
                var section = member.competencies[i];
                for (var j = 0; j < section.children.length; j++) {
                    total += section.children[j].val;
                    compCount++;
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
                    scoreWord = "Poor";
                    break;
                case 2:
                    scoreWord = "Fair";
                    break;
                case 3:
                    scoreWord = "Good";
                    break;
                case 4:
                    scoreWord = "Excellent";
                    break;
                case 5:
                    scoreWord = "Perfect";
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
    svc.recommend = function (member) {
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
        if (!Utility.empty(member) && !Utility.empty(member.competencies)) {
            for (var i = 0; i < member.competencies.length; i++) {
                for (var j = 0; j < member.competencies[i].children.length; j++) {
                    var comp = member.competencies[i].children[j];
                    for (k = 0; k < Resources.resources.length; k++) {
                        resource = Resources.resources[k];
                        var nAlignments = resource.alignments.length;
                        for (var z = 0; z < nAlignments; z++) {
                            var alignment = resource.alignments[z];
                            if (alignment.competencyId == comp.id) {
                                Resources.resources[k].score += svc.resourceScore(alignment.weight, comp.val,
                                    resourceAlignmentCounts[resource.id]
                                );
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
                    svc.recommendations.push({
                        resourceId: resource.id,
                        number: resource.number,
                        name: resource.name,
                        weight: resource.score
                    });
                }
            }
        }
        svc.recommendations = svc.recommendations.sort(function (a, b) {
            return a["weight"] > b["weight"] ? -1 : a["weight"] < b["weight"] ? 1 : 0;
        });
    };
    svc.sliderTransform = function (member, competency, idx, isUpdate) {
        var slider = $("#competency_item_" + competency.id);
        var scoreWord = svc.scoreWord(competency.val);
        var levelEl = slider.find("span.bubble.low");
        levelEl.html(scoreWord);
        slider.removeClass(function (index, css) {
            return (css.match(/(^|\s)slider\S+/g) || []).join(' ');
        }).addClass("slider" + competency.val);
        svc.scorify(member);
        if (isUpdate) {
            svc.recommend(member);
        }
    };
    svc.sliderChange = function (member, competency, thing, isUpdate) {
        var idx = thing.$index;
        svc.sliderTransform(member, competency, idx, isUpdate);
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
        if (svc.currentSectionIdx == svc.SECTION_ALL) {
            return 'Section Summary';
        }
        if (svc.currentSectionIdx >= 0 && svc.currentSectionIdx < svc.competencies.length) {
            name = svc.competencies[svc.currentSectionIdx].text;
        }
        return name;
    };
    svc.sectionPreviousName = function () {
        var name = '';
        if (svc.currentSectionIdx > 0) {
            name = svc.competencies[(svc.currentSectionIdx - 1)].text;
        }
        else {
            name = svc.competencies[(svc.competencies.length - 1)].text;
        }
        return name;
    };
    svc.sectionNextName = function () {
        var name = '';
        var tmpIdx = svc.currentSectionIdx;
        if (tmpIdx < 0) {
            tmpIdx = -1;
        }
        if (tmpIdx < svc.competencies.length - 1) {
            name = svc.competencies[(tmpIdx + 1)].text;
        }
        else {
            name = svc.competencies[0].text;
        }
        return name;
    };
    svc.sectionNext = function () {
        if (svc.currentSectionIdx < svc.competencies.length - 1) {
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
            svc.currentSectionIdx = svc.competencies.length - 1;
        }
    };
    svc.sectionIsFirst = function () {
        return svc.currentSectionIdx <= 0;
    };
    svc.sectionIsLast = function () {
        return svc.currentSectionIdx >= svc.competencies.length - 1;
    };

    svc.getMatrixCompetencyRowValues = function (member, currentSectionIdx) {
        var comps = [];
        if (!Utility.empty(member) && !Utility.empty(member.competencies)) {
            for (var i = 0; i < member.competencies.length; i++) {
                if (currentSectionIdx > svc.SECTION_SUMMARY) {
                    if (i == currentSectionIdx || currentSectionIdx == svc.SECTION_ALL) {
                        for (var j = 0; j < member.competencies[i].children.length; j++) {
                            comps.push(member.competencies[i].children[j]);
                        }
                    }
                }
                else {
                    comps.push(member.competencies[i]);
                }
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
    svc.getMatrixCompetencyRowHeader = function (e, maxLength, currentSectionIdx) {
        var names = [];
        if (e.members.length > 0) {
            var comps = e.members[0].competencies;
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
