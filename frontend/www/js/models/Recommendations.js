/**
 * Created by Greg Emerson on 11/16/15.
 */
'use strict';

// The competency info I need are question_id, response, max_range, min_range, rank
// The interface for the competency objects must be:
/*
getId(), getResponse(), hasNoResponse(), hasMaxResponse(), getRank()
*/

angular.module('Recommendations', []).service('Recommendations', function (competencies, resourceAlignments, Utility) {
    var self = this;

    // Make our own list of competencies
    self.competencies = [];
    competencies.forEach(function(c) {
        self.competencies[c.getId()] = c;
    });

    // Determine, for each competency, how well we can cover with a resource.
    self.maxCoveringStrengths = [];
    self.competencies.forEach(function(c) {
        self.maxCoveringStrengths[c.getId()] = 0;
    });

    resourceAlignments.forEach(function(a) {
        if (!(a.question_id in self.competencies)) {
            return;
        }
        if (self.maxCoveringStrengths[a.question_id] < a.weight) {
            self.maxCoveringStrengths[a.question_id] = a.weight;
        }
    });

    // Map resources to the competencies they maximally cover
    var resourceCoverages = [];
    resourceAlignments.forEach(function(a) {
        if (!(a.question_id in self.competencies)) {
            return;
        }
        if (!(a.resource_id in resourceCoverages)) {
            resourceCoverages[a.resource_id] = {
                id: a.resource_id,
                competencies: {},
                totalWeight: 0
            };
        }
        if (a.weight == self.maxCoveringStrengths[a.question_id]) {
            resourceCoverages[a.resource_id].
                competencies[a.question_id] = a.weight;
        }
    });

    // Put coverages into an indexed list for sorting
    self.resourceCoverages = [];
    for (var key in resourceCoverages) {
        if (resourceCoverages.hasOwnProperty(key)) {
            self.resourceCoverages.push(resourceCoverages[key]);
        }
    }

    // When we select a resource we will need to reduce covering weights in
    // non-selected resources when their competencies overlap with the selected one
    self.reduceCoverings = function(selected, unselected) {
        unselected.forEach(function(resource) {
            for (var compId in resource.competencies) {
                if (selected.competencies.hasOwnProperty(compId)) {
                    resource.totalWeight -= self.competencies[compId].getRank();
                    delete resource.competencies[compId];
                }
            }
        });
    };

    self.getResourceList = function() {
        var resourceList = [];
        var coverages = self.resourceCoverages.slice();
        // Calculate resource total coverage weights
        coverages.forEach(function(rc) {
            rc.totalWeight = 0;
            for (var id in rc.competencies) {
                if (self.competencies.hasOwnProperty(id) && self.includeCompetency(id)) {
                    rc.totalWeight += self.competencies[id].getRank();
                }
            }
        });
        while (true) {
            // Sort by ascending total coverage weight
            coverages.sort(function (r1, r2) {
                return r1.totalWeight - r2.totalWeight;
            });
            var needResort = false;
            for (var r = coverages.length - 1; r >= 0; r--) {
                var resource = coverages[r];
                coverages.splice(r, 1);
                for (var id in resource.competencies) {
                    if (self.competencies.hasOwnProperty(id) && self.includeCompetency(id)) {
                        resourceList.push(resource.id);
                        self.reduceCoverings(resource, coverages);
                        needResort = true;
                        break;
                    }
                }
                if (needResort) {
                    break;
                }
            }
            if (coverages.length == 0) {
                break;
            }
        }
        return resourceList;
    };
    
    self.includeCompetency = function(id) {
        if (!(id in self.competencies)) {
            return false;
        }
        var competency = self.competencies[id];
        return (competency.hasNoResponse() || competency.hasMaxResponse())
    }
});