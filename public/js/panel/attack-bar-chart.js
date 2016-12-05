/**
 * Created by sunny on 12/4/16.
 */
define(["d3"],function(d3){


    /**
     * This class is responsible for the modifiying the intruments
     * on the ui
     * @type {null}
     */

    var instance = null;
    var svg = d3.select("#attack-bar-chart"),
        width = +nodeLinkSVG.attr("width"),
        height = +nodeLinkSVG.attr("height");

    /**
     * 1. Check if instance is null then throw error
     * 2. Calls the load ui related to this class
     * @constructor
     */
    function AttackBarChart() {
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
    AttackBarChart.getInstance = function () {
        // gets an instance of the singleton. It is better to use
        if (instance === null) {
            instance = new LoadData();
        }
        return instance;
    };

    /**
     *
     * @param _data
     */
    AttackBarChart.prototype.init = function (_data) {

    }


    return AttackBarChart.getInstance();
})