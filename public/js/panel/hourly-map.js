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
    HourlyMap.prototype.init = function (_data, _dispatch) {
        var self = this;




        var entries = d3.entries(_data);
        entries.sort(function(a,b){
            return a.key - b.key;
        })

        svg.attr("width",entries.length * 45);


        var max_value = d3.max(entries,function(d){
            return d.value;
        })
        var min_value = d3.min(entries,function(d){
            return d.value;
        })

        var ramp=d3.scaleLinear().domain([min_value,max_value]).range([0.3,1]);


        var xIndex = -10;
        var textXIndex = -10;

        var hour = svg.selectAll(".hour")
                    .data(entries);

        var hourRect = hour.enter().append("rect").merge(hour);
        hourRect.exit().remove();
        hourRect.attr("x",function(){
                xIndex += 40;
                return xIndex;
            })
            .attr("width",40)
            .attr("height",30)
            .style("fill","red")
            .style("fill-opacity",function(d){
                return ramp(d.value);
            });

        var hourText = hour.enter().append("text").merge(hour);
        hourText.exit().remove();
        hourText.attr("x",function(){
                textXIndex += 40;
                return textXIndex + 10;
            })
            .attr("y",20)
            .text(function(d){
                return d.key;
            });

    }


    return HourlyMap.getInstance();
})