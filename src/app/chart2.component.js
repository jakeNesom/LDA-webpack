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
var platform_browser_1 = require('@angular/platform-browser');
var loggerdata_service_1 = require('./loggerdata.service');
//ng on changes
//http://stackoverflow.com/questions/35823698/how-to-make-ngonchanges-work-in-angular2
var Chart2 = (function () {
    function Chart2(loggerService, sanitizer) {
        this.loggerService = loggerService;
        this.sanitizer = sanitizer;
        //incoming data from loggingService Get request
        this.dataset = [];
        //public clientTotals:any[] = [];
        this.clientTotals = {};
        this.filters = { client: "ANY", node: "ANY", time: "ANY" };
        this.clientLabels = [];
        this.nodeLabels = [];
        // variable toggles activelyLook() to stop the repeating get requests
        this.activelyLookForData = true;
        this.chart = {};
        this.options = {};
        this.options = {
            title: { text: "Node Logger Data" },
            chart: { type: 'spline' },
            series: [{
                    data: [12, 14, 60, 14, 30],
                }]
        };
    }
    Chart2.prototype.ngOnChanges = function (changes) {
        console.log("onChange fired");
        console.log("changing", changes);
        for (var key in changes) {
            if (key == "currentClientC") {
                this.filters.client = this.currentClientC;
            }
            if (key == "currentNodeC") {
                this.filters.node = this.currentNodeC;
            }
            if (key == "timeFilterC") {
                this.filters.time = this.timeFilterC;
            }
        }
    };
    Chart2.prototype.saveInstance = function (chartInstance) {
        this.chart = chartInstance;
    };
    Chart2.prototype.ngOnInit = function () {
        var _this = this;
        this.loggerService.getLoggerData()
            .then(function (dataset) { return _this.dataset = dataset; });
        this.loggerService.getLoggerData()
            .then(function (dataset) { return _this.setData(dataset); });
    };
    Chart2.prototype.lookForNewData = function () {
        while (this.activelyLookForData = true) {
            setTimeout(function () {
                var newData;
                this.loggerService.getLoggerData()
                    .then(function (data) { return newData = data; });
                if (newData !== this.dataset) {
                    this.dataset = newData;
                }
            }, 8000);
        }
    };
    Chart2.prototype.setData = function (incomingData, filter) {
        if (incomingData) {
            this.dataset = incomingData;
            this.dataset = this.dataset.slice();
        }
        this.nodeFilter();
        this.setClientLabels(this.dataset);
        //this.removeExtraLabels();
        this.setNodeLabels(this.dataset);
        this.countAllClientsNodes(this.dataset);
        this.setBarChartData();
        this.updateData();
    };
    Chart2.prototype.setClientLabels = function (incomingData) {
        var labels = [];
        //create labels array which fills 'pieChartLables[]'
        for (var x = 0; x < incomingData.length; x++) {
            if (labels.indexOf(incomingData[x].client) === -1) {
                labels.push(incomingData[x].client);
            }
        }
        this.clientLabels = labels;
    };
    // right now ng-2 charts only refreshes data when a label from the barChartData[x].label value has changed
    // 
    Chart2.prototype.removeExtraLabels = function () {
        if (this.barChartData.length > this.clientLabels.length) {
            var extra = this.barChartData.length - this.clientLabels.length;
            var length_1 = this.clientLabels.length;
            this.barChartData.splice(5, 1);
            this.barChartData = this.barChartData.slice();
        }
    };
    Chart2.prototype.setNodeLabels = function (incomingData) {
        var labels = [];
        //create labels array which fills 'pieChartLables[]'
        for (var x = 0; x < incomingData.length; x++) {
            if (labels.indexOf(incomingData[x].node) === -1) {
                labels.push(incomingData[x].node);
            }
        }
        this.nodeLabels = labels;
        this.nodeLabels = this.nodeLabels.slice();
    };
    Chart2.prototype.countAllClientsNodes = function (incomingData, filter) {
        var clabels = [];
        var nlabels = [];
        clabels = this.clientLabels;
        nlabels = this.nodeLabels;
        for (var h = 0; h < clabels.length; h++) {
            this.clientTotals[clabels[h]] = {};
            for (var i = 0; i < nlabels.length; i++) {
                this.clientTotals[clabels[h]][nlabels[i]] = {};
                this.clientTotals[clabels[h]][nlabels[i]]["total"] = 0;
            }
        }
        // populate client section of clientTotals array & initialize 'total' property value
        for (var i = 0; i < this.nodeLabels.length; i++) {
            this.barChartLabels[i] = this.nodeLabels[i];
        }
        // for each present Client
        var size = 0;
        for (var client in this.clientTotals) {
            //cycle through every array property
            for (var i = 0; i < incomingData.length; i++) {
                // if one of the array properties matches this client
                if (client == incomingData[i].client) {
                    //cycle through each node for that client
                    for (var node in this.clientTotals[client]) {
                        // if if one of the nodes matches the incoming data array nodes
                        if (node == incomingData[i].node) {
                            // incrememnt the 'total' property of clienttotals.thisclient.thisnode.total
                            this.clientTotals[client][node]["total"]++;
                        }
                    }
                }
            }
            size++;
        }
    };
    Chart2.prototype.setBarChartData = function () {
        // Initialize barChartData object array
        // -- if you don't initialize the array with the number of objects it will contain,
        // the data won't show up correctly
        //this.barChartData = new Array(this.clientLabels.length-1);
        // get clientTotals associative array length
        // copy data to barChartData array
        var size = 0;
        for (var client in this.clientTotals) {
            var dataSize = 0;
            this.barChartData[size] = {};
            this.barChartData[size]["label"] = client;
            this.barChartData[size]["data"] = [];
            for (var node in this.clientTotals[client]) {
                this.barChartData[size]["data"][dataSize] = 0;
                this.barChartData[size]["data"][dataSize] = this.clientTotals[client][node]["total"];
                dataSize++;
            }
            size++;
        }
        this.barChartData = this.barChartData.slice();
    };
    Chart2.prototype.timeFilter = function () {
    };
    Chart2.prototype.nodeFilter = function () {
        if (this.filters.node != "ALL") {
        }
    };
    Chart2.prototype.updateData = function () {
        this.chart.chart.labels = this.barChartLabels.slice();
        this.chart.chart.datasets = this.barChartData.splice(this.barChartData.length, 1);
    };
    // THE FOLLOWING FUNCTIONS ARE LEFTOVER FROM THE ng2-charts examples I used to create this Component, none are being used
    Chart2.prototype.randomize = function () {
        var _lineChartData = new Array(this.lineChartData.length);
        for (var i = 0; i < this.lineChartData.length; i++) {
            _lineChartData[i] = { data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label };
            for (var j = 0; j < this.lineChartData[i].data.length; j++) {
                _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
            }
        }
        this.lineChartData = _lineChartData;
    };
    Chart2.prototype.chartClicked = function (e) {
        console.log(e);
    };
    Chart2.prototype.chartHovered = function (e) {
        console.log(e);
    };
    // events
    Chart2.prototype.barChartClicked = function (e) {
        console.log(e);
    };
    Chart2.prototype.barChartHovered = function (e) {
        console.log(e);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Chart2.prototype, "currentClientC", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Chart2.prototype, "currentNodeC", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Chart2.prototype, "timeFilterC", void 0);
    Chart2 = __decorate([
        core_1.Component({
            selector: 'chart2',
            templateUrl: 'app/views/chart2.html',
        }), 
        __metadata('design:paramtypes', [loggerdata_service_1.LoggerService, platform_browser_1.DomSanitizer])
    ], Chart2);
    return Chart2;
}());
exports.Chart2 = Chart2;
//# sourceMappingURL=chart2.component.js.map