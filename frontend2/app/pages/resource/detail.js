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
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var ionic_angular_1 = require("ionic-angular");
var resource_1 = require("../../providers/resource");
var ResourceDetailPage = (function () {
    function ResourceDetailPage(nav, navParams, resourceData, http, sanitizer) {
        var _this = this;
        this.nav = nav;
        this.navParams = navParams;
        this.sanitizer = sanitizer;
        var that = this;
        this.resource = this.navParams.data;
        resourceData.getSingle(this.resource.id).then(function (resource) {
            _this.resource = resource;
            http.get('http://pharmacy.dev2.cog/api3/resource/content/nursing:nrs002')
                .map(function (res) { return res.text(); })
                .subscribe(function (res) { return _this.content = _this.adjustContent(res); }, function () { return console.log('retrieved content ', _this.content); });
        });
    }
    ResourceDetailPage.prototype.adjustContent = function (content) {
        var pos = content.indexOf('[VID:');
        if (pos >= 0) {
            var iframe = '<div class="video-embed"><iframe style="max-width:560px; max-height:315px; margin: 0 auto;" width="560" height="315" src="https://www.youtube.com/embed/ZZZ" frameborder="0" allowfullscreen></iframe></div>';
            var replacer = '';
            for (var i = pos + 5; i < content.length && content.substr(i, 1) != ']'; i++) {
                replacer += content.substr(i, 1);
            }
            iframe = iframe.replace('ZZZ', replacer);
            replacer = '[VID:' + replacer + ']';
            console.log('replacer', replacer);
        }
        return content.replace(replacer, iframe);
    };
    ResourceDetailPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/resource/detail.html',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.NavParams, resource_1.ResourceProvider, http_1.Http, platform_browser_1.DomSanitizationService])
    ], ResourceDetailPage);
    return ResourceDetailPage;
}());
exports.ResourceDetailPage = ResourceDetailPage;
