"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var DataModel = (function () {
    function DataModel(name, toastCtrl, http, globals, config, session) {
        this.name = name;
        this.toastCtrl = toastCtrl;
        this.http = http;
        this.globals = globals;
        this.config = config;
        this.session = session;
        this.baseUrl = '/assets/api';
        this.name = this.constructor.name.replace('Provider', '').toLowerCase();
        this.baseUrl = '/assets/api/' + name;
    }
    DataModel.buildArgs = function (args) {
        var argStr = '';
        if (args) {
            argStr = '/' + args.join('/');
        }
        return argStr;
    };
    DataModel.postOptions = function () {
        var headers = new http_1.Headers({
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        });
        var options = new http_1.RequestOptions({
            headers: headers
        });
        return options;
    };
    DataModel.prototype.checkResult = function (result, notify) {
        if (result.code !== 200) {
            console.error('SERVER ERROR: ' + result.message);
        }
        if (notify) {
            var toast = this.toastCtrl.create({
                message: result && result.code != 200 ? result.message : 'Okay!',
                duration: 4000,
                position: 'middle',
                showCloseButton: true,
                closeButtonText: 'Dismiss',
                dismissOnPageChange: true,
                cssClass: result && result.code == 200 ? "success" : "error"
            });
            toast.present();
        }
        if (result && result.code == 500 && result.message && result.message.indexOf('Not logged in') >= 0) {
            console.log('logging out...');
            this.session.logout();
        }
    };
    DataModel.prototype.loadData = function (urlSegment) {
        var _this = this;
        var provider = this;
        var url = this.baseUrl + urlSegment;
        if (this.globals.debug) {
            console.log('data loading: ' + url);
        }
        return new Promise(function (resolve) {
            _this.http.get(url).subscribe(function (res) {
                try {
                    var jsonResponse = res.json();
                    if (jsonResponse.code !== 200) {
                        provider.globals.alertError('Sorry.  There was an error loading data from the server.  Please try again.');
                        console.error('ERROR FOR:' + url + '::RESULT=' + jsonResponse.message);
                    }
                    var data = jsonResponse.data;
                    if (_this.globals.debug) {
                        console.log('jsonResponse: ', jsonResponse);
                        console.log('data retrieved::', data);
                    }
                    resolve(data);
                }
                catch (exception) {
                    console.error(exception);
                }
            }, function (err) {
                _this.checkResult(err, true);
            });
        });
    };
    DataModel.prototype.getData = function (urlSegment) {
        return this.loadData(urlSegment);
    };
    DataModel.prototype.displayError = function (err) {
        console.log(err);
        var toast = this.toastCtrl.create({
            message: 'Sorry.  An error occurred on the server.' + (err.status != 500 ? err.message : ''),
            position: 'middle',
            showCloseButton: true,
            closeButtonText: 'Dismiss',
            dismissOnPageChange: true,
            cssClass: "error"
        });
        toast.present();
    };
    DataModel.prototype.unsetList = function () {
        this.list = null;
    };
    DataModel.prototype.getAll = function (args, resetFirst) {
        var _this = this;
        if (resetFirst) {
            this.unsetList();
        }
        else {
            if (this.list) {
                return Promise.resolve(this.list);
            }
        }
        var url = '/list' + (typeof args == 'string' ? args : '');
        return this.getData(url).then(function (data) {
            _this.list = data;
            return _this.list;
        });
    };
    DataModel.prototype.getSingle = function (modelId) {
        var _this = this;
        return this.getData('/single/' + modelId).then(function (data) {
            _this.single = data;
            return _this.single;
        }, function (error) {
            _this.globals.alertError('Error loading ' + _this.name + ' data record.');
        });
    };
    DataModel.prototype.getPostData = function (urlSegment, data, notify) {
        var _this = this;
        var provider = this;
        var body = JSON.stringify({ data: data });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = this.baseUrl + urlSegment;
        if (provider.globals.debug) {
            console.log('postData:' + url, data);
        }
        return new Promise(function (resolve) {
            _this.http.post(url, body, options).subscribe(function (result) {
                var jsonResponse = result.json();
                _this.checkResult(jsonResponse, notify);
                var data = jsonResponse.data;
                if (provider.globals.debug) {
                    console.log(url + ':post returned:', data);
                }
                resolve(data);
            }, function (error) {
                _this.globals.alertError('There was an error on the server.');
            });
        });
    };
    DataModel.prototype.update = function (data, notify) {
        return this.getPostData('/update', data, notify);
    };
    DataModel.prototype.remove = function (id, notify) {
        return this.getData('/delete/' + id);
    };
    DataModel.prototype.add = function (data, notify) {
        return this.getPostData('/add', data, notify);
    };
    DataModel = __decorate([
        core_1.Injectable()
    ], DataModel);
    return DataModel;
}());
exports.DataModel = DataModel;
