/**
 * Created by sunny on 12/2/16.
 */

define(["d3", "node-link", "line-chart", "rect-diag", "hourly-map", "allColors","legend","attack-bar-chart-2"],
    function (d3, nodeLink, lineChart, rectDiag, hourlyMap,  allColors, legend, attackBarChart2) {

        /**
         * This class is responsible for the modifiying the intruments
         * on the ui
         * @type {null}
         */

        var instance = null;
        var nodesmap = {};
        var linkVal = {};
        var links = [];
        var nodes = [];
        var attackData = {};
        var attackNameSet = new Set();
        var heatMapHourly = {};
        var lineChartData = {};
        var dispatch = d3.dispatch("nodeLinkCallBack", "hourlyMapCallBack",
            "rectDiagCallBack", "attackBarChartClickCallBack",
            "lineChartCallBack");

        //added the unknown name in the attack set
        attackNameSet.add("Unknown")


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
         * this is the call back from the node link class
         * @param obj
         */
        function nodeLinkCallBack(selectedNodes){

            var largestVal = Number.MIN_VALUE;
            var smallestVal = Number.MAX_VALUE;
            var selectedLinks = [];

            if(selectedNodes.length > 0) {

                var sourceNodeMap = {};
                selectedNodes.forEach(function (d) {
                    if (!sourceNodeMap.hasOwnProperty(d.id)) {
                        sourceNodeMap[d.id] = {};
                    }
                })


                links.forEach(function (link) {
                    if (sourceNodeMap.hasOwnProperty(link.source.id)
                        || sourceNodeMap.hasOwnProperty(link.target.id) ) {

                        if (largestVal < link.value) {
                            largestVal = link.value;
                        }
                        if (smallestVal > link.value) {
                            smallestVal = link.value;
                        }

                        selectedLinks.push(link);
                    }
                });

                //////////////////////////////////////ATTACK MAP DATA/////////////////////////


                var newAttackData = {};
                for(var attackIP in attackData){
                    if(sourceNodeMap.hasOwnProperty(attackIP)){
                        newAttackData[attackIP] = attackData[attackIP];
                    }
                }

                attackBarChart2.reload(newAttackData);

                ///////////////////////////////////////////RECT DIAG///////////////////////////////

                var scale = d3.scaleLinear()
                    .domain([smallestVal, largestVal])
                    .range([10, 50]);

                selectedLinks.sort(descending);
                for (var index = 0, yIndex = 0; index < selectedLinks.length; index++) {
                    selectedLinks[index].height = scale(selectedLinks[index].value);
                    selectedLinks[index].yIndex = yIndex;
                    yIndex += selectedLinks[index].height + 3;
                }

                rectDiag.reload(selectedLinks);

                ///////////////////////////////////////////////////////////////////////////////////
            }
        }
        dispatch.on("nodeLinkCallBack",nodeLinkCallBack);



        /**
         * load with the initial data
         * @param _callback
         * @param _instance
         */
        LoadData.prototype.init = function (file) {

            nodesmap = {};
            linkVal = {};
            links = [];
            nodes = [];
            attackData = {};
            attackNameSet = new Set();
            heatMapHourly = {};
            lineChartData = {};


            var largestVal = Number.MIN_VALUE;
            var smallestVal = Number.MAX_VALUE;

            //added the unknown name in the attack set
            attackNameSet.add("Unknown")

            var dsv = d3.dsvFormat(" ");
            d3.text(file, function (rows) {

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

                    if(parseInt(d.score) > 0){

                        if(!attackData.hasOwnProperty(d.dest)){
                            attackData[d.dest] = { attacks: {}, totalCount: 0};
                        }

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
                //for(var destIP in attackData){
                //    attackNameSet.forEach(function(attackName){
                //        if(!attackData[destIP].attacks.hasOwnProperty(attackName)){
                //            attackData[destIP].attacks[attackName] = {value : 0, name: attackName}
                //        }
                //    })
                //}

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

                allColors.init(nodesmap, linkVal, attackNameSet);
                legend.init();

                //initialze all the data structure
                hourlyMap.init(heatMapHourly, dispatch);
                nodeLink.init(nodes, links, attackData, dispatch);
                rectDiag.init(links, dispatch);
                attackBarChart2.init(attackData, dispatch);
                lineChart.init(lineChartData, dispatch);

            });
        }
        return LoadData.getInstance();
    })

