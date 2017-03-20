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
var core_2 = require('@angular/core');
var loggerdata_service_1 = require('./loggerdata.service');
var ng2_charts_1 = require('ng2-charts');
//ng on changes
//http://stackoverflow.com/questions/35823698/how-to-make-ngonchanges-work-in-angular2
var SetChart = (function () {
    // creating instance of LoggerService
    function SetChart(loggerService, sanitizer, _applicationRef) {
        this.loggerService = loggerService;
        this.sanitizer = sanitizer;
        this._applicationRef = _applicationRef;
        //incoming data from loggingService Get request
        this.dataset = [];
        //public clientTotals:any[] = [];
        this.clientTotals = {};
        this.filters = { client: "ANY", node: "ANY", time: "ANY" };
        this.clientLabels = [];
        this.nodeLabels = [];
        this.initFlag = false;
        this.newDataListening = false;
        // variable toggles activelyLook() to stop the repeating get requests
        /** Bar Chart Variables  */
        this.barChartOptions = {
            scaleShowVerticalLines: false,
            responsive: true
        };
        this.barChartLabels = ['NodeA', "NodeB", "NodeC"];
        this.barChartType = 'bar';
        this.barChartLegend = true;
        this.barChartData = [
            { data: ["3", "2"], label: "Client A" },
            { data: ["2", "1"], label: "Client B" },
            { data: ["5", "2"], label: "Client C" },
            { data: ["5", "2"], label: "Client D" },
            { data: ["5", "2"], label: "Client E" },
            { data: ["5", "2"], label: "Client F" },
        ];
    }
    SetChart.prototype.ngOnChanges = function (changes) {
        var _this = this;
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
        if (this.initFlag = true) {
            this.loggerService.getLoggerData()
                .then(function (dataset) { return _this.setData(dataset); });
        }
        if (this.activelyLookForDataC !== this.newDataListening) {
            this.newDataListening = this.activelyLookForDataC;
        }
    };
    // on init - run get service and initially set the data
    SetChart.prototype.ngOnInit = function () {
        // this.loggerService.getLoggerData()
        //  .then(dataset => this.dataset = dataset );
        var _this = this;
        this.loggerService.getLoggerData()
            .then(function (dataset) { return _this.setData(dataset); });
    };
    SetChart.prototype.lookForNewData = function () {
        while (this.newDataListening = true) {
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
    SetChart.prototype.setData = function (incomingData, filter) {
        this.oldBarChartData = this.barChartData;
        this.oldBarChartLabeles = this.barChartLabels;
        // this if statement should only be true on init
        if (incomingData) {
            this.dataset = incomingData;
            this.dataset = this.dataset.slice();
            this.initFlag = true;
        }
        //  if( !incomingData )
        //  {
        //    this.loggerService.getLoggerData()
        //   .then( dataset => this.setData(dataset) );
        //  }
        // filter time, then client, then node
        if (this.timeFilterC != "ALL") {
            this.filterTime();
        }
        if (this.currentClientC != "ALL") {
            this.filterClient();
        }
        if (this.currentNodeC !== "ALL") {
            this.filterNode();
        }
        // set labels
        this.setClientLabels(this.dataset);
        //this.removeExtraLabels();
        this.setNodeLabels(this.dataset);
        this.countAllClientsNodes(this.dataset);
        this.setBarChartData();
        this.removePreviousData();
        //this.updateData();
    };
    SetChart.prototype.filterTime = function () {
        var data = this.dataset;
        var currentTime = ["12", "31", "00"];
        var currentMinutes = parseInt(currentTime[1]);
        var i = 0;
        while (i < data.length) {
            var time = data[i].time.split(":");
            var minutes = parseInt(time[1]);
            if (this.timeFilterC == "Last 5") {
                if (minutes <= (currentMinutes - 5)) {
                    data.splice(i, 1);
                }
                else
                    i++;
            }
            else if (this.timeFilterC == "Last 30") {
                if (minutes <= (currentMinutes - 30)) {
                    data.splice(i, 1);
                }
                else
                    i++;
            }
        }
        this.dataset = data.slice();
    };
    SetChart.prototype.filterClient = function () {
        var data = this.dataset;
        var i = 0;
        while (i < data.length) {
            if (data[i].client != this.currentClientC) {
                data.splice(i, 1);
            }
            else
                i++;
        }
        this.dataset = data;
        this.dataset.slice();
    };
    SetChart.prototype.filterNode = function () {
        var data = this.dataset;
        var i = 0;
        while (i < data.length) {
            if (data[i].node != this.currentNodeC) {
                data.splice(i, 1);
            }
            else
                i++;
        }
        this.dataset = data;
        this.dataset.slice();
    };
    SetChart.prototype.setClientLabels = function (incomingData) {
        var labels = [];
        //create labels array which fills 'pieChartLables[]'
        for (var x = 0; x < incomingData.length; x++) {
            if (labels.indexOf(incomingData[x].client) === -1) {
                labels.push(incomingData[x].client);
            }
        }
        this.clientLabels = labels;
        this.clientLabels.slice();
    };
    // right now ng-2 charts only refreshes data when a label from the barChartData[x].label value has changed
    // 
    SetChart.prototype.removePreviousData = function () {
        var chartExtra = this.oldBarChartData.length - this.barChartData.length;
        var labelExtra = this.oldBarChartLabeles.length - this.barChartLabels.length;
        if (chartExtra > 0) {
            this.barChartData.splice(chartExtra);
        }
        if (labelExtra > 0) {
            this.barChartLabels.splice(labelExtra);
        }
    };
    SetChart.prototype.setNodeLabels = function (incomingData) {
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
    SetChart.prototype.countAllClientsNodes = function (incomingData, filter) {
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
    SetChart.prototype.setBarChartData = function () {
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
    // public updateData () {
    //   this.chart.chart.labels = this.barChartLabels.slice();
    //   this.chart.chart.datasets = this.barChartData.splice(this.barChartData.length,1);
    // }
    // THE FOLLOWING FUNCTIONS ARE LEFTOVER FROM THE ng2-charts examples I used to create this Component, none are being used
    SetChart.prototype.chartClicked = function (e) {
        console.log(e);
    };
    SetChart.prototype.chartHovered = function (e) {
        console.log(e);
    };
    // events
    SetChart.prototype.barChartClicked = function (e) {
        console.log(e);
    };
    SetChart.prototype.barChartHovered = function (e) {
        console.log(e);
    };
    SetChart.prototype.barChartRandomize = function () {
        // Only Change 3 values
        var data = [
            Math.round(Math.random() * 100),
            59,
            80,
            (Math.random() * 100),
            56,
            (Math.random() * 100),
            40];
        var clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    };
    __decorate([
        core_1.ViewChild(ng2_charts_1.BaseChartDirective), 
        __metadata('design:type', ng2_charts_1.BaseChartDirective)
    ], SetChart.prototype, "chart", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SetChart.prototype, "currentClientC", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SetChart.prototype, "currentNodeC", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SetChart.prototype, "timeFilterC", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SetChart.prototype, "activelyLookForDataC", void 0);
    SetChart = __decorate([
        core_1.Component({
            selector: 'setChart',
            templateUrl: 'app/views/setchart.html',
        }), 
        __metadata('design:paramtypes', [loggerdata_service_1.LoggerService, platform_browser_1.DomSanitizer, core_2.ApplicationRef])
    ], SetChart);
    return SetChart;
}());
exports.SetChart = SetChart;
//# sourceMappingURL=setChart.component.js.map