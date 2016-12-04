/**
 * Created by sunny on 12/2/16.
 */
define(["d3","d3-dsv"],function(d3,d3dsv){

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
     * load with the initial data
     * @param _callback
     * @param _instance
     */
    LoadData.prototype.init = function(_files) {
        //

        var dsv = d3.dsv("|", "text/plain");
        //console.log(d3.dsv(" "));
        ////var dsv = d3dsv.dsv(' ');
        //console.log("check");
        //
        //d3.dsv("../data/tcpdump.csv",function(d){
        //    console.log(d);
        //})
        //
        //d3.text("../data/tcpdump.csv").get(function(error,rows) {
        dsv("../data/tcpdump.csv", function (data) {

            console.log(data)
            //if (error) throw error;
            //var data = dsv(rows);

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
                }
            }

            for (var key in nodesmap) {
                nodes.push({id: nodesmap[key], group: 1});
            }
        });

    }
    return LoadData.getInstance();
})