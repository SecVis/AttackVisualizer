/**
 * Created by sunny on 12/2/16.
 */
define(["d3", "node-link", "attack-bar-chart", "line-chart", "rect-diag", "hourly-map"],
    function (d3, nodeLink, attackBarChart, lineChart, rectDiag, hourlyMap) {

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
        var attackData = {};
        var attackNameSet = new Set();
        var heatMapHourly = {};
        var lineChartData = {};

        //added the unknown name in the attack set
        attackNameSet.add("Unknown")

        var dsv = d3.dsvFormat(" ");
        d3.text("../data/tcpdump.csv", function (rows) {

            var data = dsv.parse(rows);
            data.forEach(function (d) {
                console.log(d);
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


                if(!attackData.hasOwnProperty(d.dest)){
                    attackData[d.dest] = { attacks: {}, totalCount: 0};
                }

                if(parseInt(d.score) > 0){

                    ////////////////////////////////////////////////////////////////////
                    var hour = d.time.split(":")[0];
                    if(!heatMapHourly.hasOwnProperty(hour)){
                        heatMapHourly[hour] = 0;
                    }
                    heatMapHourly[hour]++;

                    ////////////////////////////ATTACK DATA and LINE CHART DATA/////////////////////////////
                    if(d.attack != "-"){
                        var attacks = d.attack.split(",");
                        attacks.forEach(function(a){

                            //this will keep all the unique attack name
                            attackNameSet.add(a);

                            //create the attack set if its not preset
                            if(!attackData[d.dest].attacks.hasOwnProperty(a)){
                                attackData[d.dest].attacks[a] = {value : 0, name: a}
                            }

                            //increment the attack count
                            attackData[d.dest].attacks[a].value += 1;
                            attackData[d.dest].totalCount += 1;


                            //line chart data
                            if(!lineChartData.hasOwnProperty(a)){
                                lineChartData[a] = { timelist: [], totalCount: 0};
                            }

                            lineChartData[a].timelist.push(d.time);
                            lineChartData[a].totalCount++;
                        });
                    }
                    else{

                        //create the attack set if its not preset
                        if(!attackData[d.dest].attacks.hasOwnProperty("Unknown")){
                            attackData[d.dest].attacks["Unknown"] = {value : 0, name: "Unknown"}
                        }

                        attackData[d.dest].attacks["Unknown"].value += 1;


                        //line chart data
                        if(!lineChartData.hasOwnProperty("Unknown")){
                            lineChartData["Unknown"] = { timelist: [], totalCount: 0};
                        }

                        lineChartData["Unknown"].timelist.push(d.time);
                        lineChartData["Unknown"].totalCount++;
                    }
                }
            });

            ///////////////////////////////// ATTACK DATA  //////////////////////////////////////
            //add all the attacks in the data structure for each
            //attack to store the value ZERO value for stack bar
            //chart
            for(var destIP in attackData){
                attackNameSet.forEach(function(attackName){
                    if(!attackData[destIP].attacks.hasOwnProperty(attackName)){
                        attackData[destIP].attacks[attackName] = {value : 0, name: attackName}
                    }
                })
            }

            var modifiedAttackData = [];
            var columns = [];
            var i = 0;
            for(var destIP in attackData){
                var attackObj = {};
                if(i==0) {
                    columns.push("destinationIP");
                }
                attackObj["destinationIP"] = destIP;
                attackObj["total"] = attackData[destIP].totalCount;
                for(var attackName in attackData[destIP].attacks){
                    attackObj[attackName] = attackData[destIP].attacks[attackName].value;
                    if(i==0) {
                        columns.push(attackName);
                    }
                }
                if(i == 0) {
                    columns.push("total");
                }
                i++;
                modifiedAttackData.push(attackObj);
            }

            modifiedAttackData["columns"] = columns;

            ///////////////////////////////////////////////////////////////////////////////////////////////

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

            //initialze all the data structure
            hourlyMap.init(heatMapHourly)
            nodeLink.init(nodes, links);
            rectDiag.init(links);
            attackBarChart.init(modifiedAttackData);
            lineChart.init(lineChartData);
        });
    }
    return LoadData.getInstance();
})