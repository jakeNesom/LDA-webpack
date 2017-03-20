"use strict";
var InMemoryDataService = (function () {
    function InMemoryDataService() {
    }
    InMemoryDataService.prototype.createDb = function () {
        var loggerData = [
            { id: 1, client: "Client 1", time: "12:00:00", node: "Node 1" },
            { id: 2, client: "Client 1", time: "12:01:00", node: "Node 1" },
            { id: 3, client: "Client 2", time: "12:010:00", node: "Node 1" },
            { id: 4, client: "Client 1", time: "12:03:00", node: "Node 1" },
            { id: 5, client: "Client 3", time: "12:31:00", node: "Node 1" },
            { id: 6, client: "Client 2", time: "12:32:00", node: "Node 2" },
            { id: 7, client: "Client 1", time: "12:33:00", node: "Node 3" },
            { id: 8, client: "Client 4", time: "12:29:00", node: "Node 2" },
            { id: 9, client: "Client 3", time: "12:16:00", node: "Node 1" },
            { id: 10, client: "Client 1", time: "12:20:00", node: "Node 2" },
            { id: 11, client: "Client 4", time: "12:21:00", node: "Node 3" },
            { id: 12, client: "Client 5", time: "12:22:00", node: "Node 4" },
        ];
        return { loggerData: loggerData };
    };
    return InMemoryDataService;
}());
exports.InMemoryDataService = InMemoryDataService;
//# sourceMappingURL=in-memory-data.service.js.map