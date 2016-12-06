/**
 * Created by sunny on 12/6/16.
 */
define(["d3"],function(d3){


    /**
     * This class is responsible for the modifiying the intruments
     * on the ui
     * @type {null}
     */

    var instance = null;
    var svg = d3.select("#hourly-map"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    /**
     * 1. Check if instance is null then throw error
     * 2. Calls the load ui related to this class
     * @constructor
     */
    function HourlyMap() {
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
    HourlyMap.getInstance = function () {
        var self = this;

        // gets an instance of the singleton. It is better to use
        if (instance === null) {
            instance = new HourlyMap();
        }
        return instance;
    };

    /**
     *
     * @param _data
     */
    HourlyMap.prototype.init = function (_data) {
        var self = this;

        console.log(_data);
    }


    return HourlyMap.getInstance();
})