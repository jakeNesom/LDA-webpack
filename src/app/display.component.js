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
var loggerdata_service_1 = require('./loggerdata.service');
var DisplayComponent = (function () {
    function DisplayComponent(loggerService) {
        this.loggerService = loggerService;
        //incoming data from loggingService Get request
        /*
           dataset looks like this:
       
           {
             [client: "", timeCat:(1-4 value), time: "", node: ""]
           }
        */
        this.dataset = [];
        this.clientTotals = {};
        this.clientList = [];
        this.currentClient = "ALL";
        this.currentNode = "ALL";
        this.timeFilter = "ALL";
        this.activelyLookForData = true;
        this.allData = {
            clientTotals: [{ client: "", total: "" }],
            clientList: [],
            currentClient: "ALL",
            nodeList: [],
            currentNode: "ALL",
            timeList: ["ALL", "Last 30", "Last 5"],
            timeFilter: "ALL",
        };
        this.filterArray = [this.allData.currentClient, this.allData.currentNode, this.allData.timeFilter];
    }
    DisplayComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loggerService.getLoggerData()
            .then(function (dataset) { return _this.setData(dataset); });
    };
    DisplayComponent.prototype.setData = function (dataset) {
        this.dataset = dataset;
        this.dataset = this.dataset.slice();
        this.setClientList();
        this.setNodeList();
    };
    //access a service component to populate client options list
    //watch options menu for changes, execute functions based on which option selected
    DisplayComponent.prototype.setClientList = function () {
        var items = [];
        items.push("ALL");
        //create labels array which fills 'pieChartLables[]'
        // create clientTotals object keys dynamically from current clients
        for (var x = 0; x < this.dataset.length; x++) {
            if (items.indexOf(this.dataset[x].client) === -1) {
                items.push(this.dataset[x].client);
            }
        }
        this.allData.clientList = items;
    };
    DisplayComponent.prototype.setNodeList = function () {
        var items = [];
        items.push("ALL");
        //create labels array which fills 'pieChartLables[]'
        // create clientTotals object keys dynamically from current clients
        for (var x = 0; x < this.dataset.length; x++) {
            if (items.indexOf(this.dataset[x].node) === -1) {
                items.push(this.dataset[x].node);
            }
        }
        this.allData.nodeList = items;
    };
    DisplayComponent.prototype.clientChange = function (value) {
        this.allData.currentClient = value;
        this.currentClient = value;
        console.log(this.allData.currentClient);
    };
    DisplayComponent.prototype.nodeChange = function (value) {
        this.allData.currentNode = value;
        this.currentNode = value;
        console.log(this.allData.currentNode);
    };
    DisplayComponent.prototype.timeChange = function (value) {
        this.allData.timeFilter = value;
        this.timeFilter = value;
        console.log(this.allData.timeFilter);
    };
    DisplayComponent.prototype.toggleCheck = function () {
        if (this.activelyLookForData == true)
            this.activelyLookForData = false;
        else
            this.activelyLookForData = true;
    };
    DisplayComponent.prototype.resetSelect = function () {
        this.currentClient = "ALL";
        this.currentNode = "ALL";
        this.timeFilter = "ALL";
        this.allData.timeFilter = "ALL";
        this.allData.currentClient = "ALL";
        this.allData.currentNode = "ALL";
    };
    DisplayComponent = __decorate([
        core_1.Component({
            selector: 'displayComponent',
            templateUrl: "app/views/display.html",
            styleUrls: ['app/css/display.css'],
        }), 
        __metadata('design:paramtypes', [loggerdata_service_1.LoggerService])
    ], DisplayComponent);
    return DisplayComponent;
}());
exports.DisplayComponent = DisplayComponent;
//# sourceMappingURL=display.component.js.map