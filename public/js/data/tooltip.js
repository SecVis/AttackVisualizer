/**
 * Created by nishantagarwal on 12/7/16.
 */
define(["d3", "d3-tip"], function (d3, d3Tip) {

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
    function ToolTip() {
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
    ToolTip.getInstance = function () {
        // gets an instance of the singleton. It is better to use
        if (instance === null) {
            instance = new ToolTip();
        }
        return instance;
    };
    /**
     *
     * @param nodes
     * @param links
     */
    ToolTip.prototype.init = function () {

        var self = this;

        self.tip = d3Tip().attr('class', 'd3-tip')
            .offset([-20, 0])
            .html(function(d) {

                return d ;
            });
        self.tip2 = d3Tip().attr('class', 'd3-tip')
            .offset([-20, 0])
            .html(function(d) {

                return d ;
            });
    }

    ToolTip.prototype.getToolTip = function () {
        var self = this;

        return self.tip;
    }

    ToolTip.prototype.getToolTip2 = function () {
        var self = this;

        return self.tip2;
    }

    return ToolTip.getInstance();
});
