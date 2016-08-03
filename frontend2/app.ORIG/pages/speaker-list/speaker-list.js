"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var conference_data_1 = require('../../providers/conference-data');
var session_detail_1 = require('../session-detail/session-detail');
var speaker_detail_1 = require('../speaker-detail/speaker-detail');
var SpeakerListPage = (function () {
    function SpeakerListPage(nav, confData) {
        var _this = this;
        this.nav = nav;
        this.speakers = [];
        confData.getSpeakers().then(function (speakers) {
            _this.speakers = speakers;
        });
    }
    SpeakerListPage.prototype.goToSessionDetail = function (session) {
        this.nav.push(session_detail_1.SessionDetailPage, session);
    };
    SpeakerListPage.prototype.goToSpeakerDetail = function (speakerName) {
        this.nav.push(speaker_detail_1.SpeakerDetailPage, speakerName);
    };
    SpeakerListPage.prototype.goToSpeakerTwitter = function (speaker) {
        window.open("https://twitter.com/" + speaker.twitter);
    };
    SpeakerListPage.prototype.openSpeakerShare = function (speaker) {
        var actionSheet = ionic_angular_1.ActionSheet.create({
            title: 'Share ' + speaker.name,
            buttons: [
                {
                    text: 'Copy Link',
                    handler: function () {
                        console.log('Copy link clicked on https://twitter.com/' + speaker.twitter);
                        if (window['cordova'] && window['cordova'].plugins.clipboard) {
                            window['cordova'].plugins.clipboard.copy('https://twitter.com/' + speaker.twitter);
                        }
                    }
                },
                {
                    text: 'Share via ...',
                    handler: function () {
                        console.log('Share via clicked');
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        this.nav.present(actionSheet);
    };
    SpeakerListPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/speaker-list/speaker-list.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, conference_data_1.ConferenceData])
    ], SpeakerListPage);
    return SpeakerListPage;
}());
exports.SpeakerListPage = SpeakerListPage;
