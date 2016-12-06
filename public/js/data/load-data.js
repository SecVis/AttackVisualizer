/**
 * Created by sunny on 12/2/16.
 */
define(["d3", "node-link", "attack-bar-chart", "line-chart", "rect-diag"],
    function (d3, nodeLink, attackBarChart, lineChart, rectDiag) {

    /**
     * This class is responsible for the modifiying the intruments
     * on the ui
     * @type {null}
     */

    var instance = null;

    /**
     * 1. Check if instance is null then throw error
     * 2. Calls the load ui related to this class
     * @constructor
     */
    function LoadData() {
        var self = this;
        //if instance is not null then throw an error
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one LoadData, use LoadData.getInstance()");
        }
    }

    /**
     * this function returns the instance of this
     * class if not created
     * @returns {*}
     */
    LoadData.getInstance = function () {
        // gets an instance of the singleton. It is better to use
        if (instance === null) {
            instance = new LoadData();
        }
        return instance;
    };

    /**
     *
     * @param a
     * @param b
     * @returns {number}
     */
    function descending(a, b) {
        if (a.value < b.value)
            return 1;
        if (a.value > b.value)
            return -1;
        return 0;
    }


    /**
     * load with the initial data
     * @param _callback
     * @param _instance
     */
    LoadData.prototype.init = function (_files) {
        var nodesmap = {};
        var linkVal = {};
        var links = [];
        var nodes = [];
        var largestVal = Number.MIN_VALUE;
        var smallestVal = Number.MAX_VALUE;

        var dsv = d3.dsvFormat(" ");
        d3.text("../data/tcpdump.csv", function (rows) {

            var data = dsv.parse(rows);
            data.forEach(function (d) {
                if (!nodesmap.hasOwnProperty(d.src)) {
                    nodesmap[d.src] = d.src;
                }
                if (!nodesmap.hasOwnProperty(d.dest)) {
                    nodesmap[d.dest] = d.dest;
                }

                var src = nodesmap[d.src];
                var dest = nodesmap[d.dest];

                if (!linkVal.hasOwnProperty(src)) {
                    linkVal[src] = {}
                }
                if (!linkVal[src].hasOwnProperty(dest)) {
                    linkVal[src][dest] = 0;
                }

                linkVal[src][dest]++;
            });

            for (var src in linkVal) {
                for (var dest in linkVal[src]) {
                    var val = linkVal[src][dest];
                    links.push({value: val, source: src, target: dest})

                    if (largestVal < val) {
                        largestVal = val;
                    }
                    if (smallestVal > val) {
                        smallestVal = val;
                    }
                }
            }

            var scale = d3.scaleLinear()
                    .domain([smallestVal, largestVal])
                    .range([10, 50]);

            links.sort(descending);
            for (var index = 0, yIndex = 0; index < links.length; index++) {
                links[index].height = scale(links[index].value);
                links[index].yIndex = yIndex;
                yIndex += links[index].height + 3;
            }

            for (var key in nodesmap) {
                nodes.push({id: nodesmap[key], group: 1});
            }

            nodeLink.init(nodes, links);
            //attackBarChart.init();
            rectDiag.init(links)
            //
            //var lineChartData = {};
            //lineChart.init(lineChartData);
        });
    }
    return LoadData.getInstance();
})