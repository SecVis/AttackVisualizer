/**
 * Created by nishantagarwal on 12/6/16.
 */
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
    var svg = d3.select("#attack-legend"),
        width = +svg.attr("width"),
        height = +svg.attr("height");


    /**
     * 1. Check if instance is null then throw error
     * 2. Calls the load ui related to this class
     * @constructor
     */
    function AttackLegend() {
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
    AttackLegend.getInstance = function () {
        // gets an instance of the singleton. It is better to use
        if (instance === null) {
            instance = new AttackLegend();
        }
        return instance;
    };


    /**
     *
     * @param nodes
     * @param links
     */
    AttackLegend.prototype.init = function () {

        var self = this;

        var attackColor = require("allColors").getAttackColor();

        var data = d3.entries(attackColor);

        //console.log(data);

        var count = data.length;

        svg.attr("height",count*40);

        height = count*40;

        var legendgroup = svg.selectAll("g").data(data);

        legendgroup.exit().remove();

        legendgroup = legendgroup.enter().append("g").merge(legendgroup);

        legendgroup.attr("transform",function(d,i){
            return "translate(20,"+(i*(30+10))+")";
        })

        legendgroup.append("rect")
            .attr("height",30)
            .attr("width",30)
            .attr("fill",function(d){
                return d.value;
            });

        legendgroup.append("text")
            .attr("x", 60)
            .attr("y", 20)
            .attr("fill","grey")
            .text(function(d){
                return d.key;
            });

    }

    return AttackLegend.getInstance();
});