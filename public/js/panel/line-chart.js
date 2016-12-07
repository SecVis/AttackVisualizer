/**
 * Created by sunny on 12/2/16.
 */
define(["d3", "jquery"], function (d3, $) {

    /**
     * This class is responsible for the modifiying the intruments
     * on the ui
     * @type {null}
     */

    var instance = null;
    var svg = d3.select("#line-chart"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var attackBlockHeight = 30;
    var totalAttackCount = 0;


    /**
     * 1. Check if instance is null then throw error
     * 2. Calls the load ui related to this class
     * @constructor
     */
    function LineChart() {
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
    LineChart.getInstance = function () {
        // gets an instance of the singleton. It is better to use
        if (instance === null) {
            instance = new LineChart();
        }
        return instance;
    };


    /**
     *
     * @param nodes
     * @param links
     */
    LineChart.prototype.init = function (attackData,_dispatch) {

        var self = this;

        self.totalAttackCount = d3.keys(attackData).length;
        svg.attr("height", self.totalAttackCount * attackBlockHeight);

        for(var attack in attackData){
            var attackName = attack;
            var attackTimeList = attackData[attack].timelist;//array
            var attackTotalCount = attackData[attack].totalCount;

        }

    }

    return LineChart.getInstance();
});