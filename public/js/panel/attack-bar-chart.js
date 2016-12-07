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
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var stackedbarchart = svg.append("g");//.attr("transform", "translate(" + 10 + "," + 10 + ")");;
    var stack = d3.stack();


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
            instance = new AttackBarChart();
        }
        return instance;
    };

    /**
     *
     * @param _data
     */
    AttackBarChart.prototype.reload = function (_data) {
        var self = this;



        _data.sort(function(a, b) { return b.total - a.total; });

        height = 15*_data.length;

        svg.attr("height",height);


        var x = d3.scaleLinear()
            .range([50,width]);

        var z = d3.scaleOrdinal(d3.schemeCategory20);

        x.domain([0, d3.max(_data, function(d) {
                return d.total;
            })])
            .nice();
        z.domain(_data.columns.slice(1,_data.columns.length-1));

        var stackedbargroup = stackedbarchart.selectAll(".attackbarchart")
            .data(stack.keys(_data.columns.slice(1,_data.columns.length-1))(_data));

        stackedbargroup.exit().remove();

        stackedbargroup = stackedbargroup.enter().append("g").attr("class", "attackbarchart")
            .merge(stackedbargroup);


        stackedbargroup.attr("fill", function(d) {
            return z(d.key);
        });


        var stackedbar = stackedbargroup.selectAll("rect")
            .data(function(d) {
                d.forEach(function(s){
                    s["key"] = d.key;
                })
                return d;
            });

        stackedbar.exit().remove();


        stackedbar = stackedbar.enter().append("rect").merge(stackedbar);

        //console.log(stackedbar);
        stackedbar.attr("x",function(d) {d._x = x(d[0]); return x(d[0]); })
            .attr("y", function(d,i){ return i*(35+5);})
            .attr("height",35)
            .attr("width", function(d) { return x(d[1]) - x(d[0]); })
            //.on("mouseover",function(d){
            //    svg.selectAll("rect")
            //        .style("visibility",function(r){
            //            if(r.key != d.key){
            //                return "hidden";
            //            }
            //        })
            //        .attr("x", function(r){
            //            if(r.key == d.key){
            //                return 0;
            //            }
            //        })
            //})
            //.on("mouseout",function(d){
            //    svg.selectAll("rect")
            //        .style("visibility","visible")
            //        .attr("x", function(r){
            //            return r._x;
            //        })
            //});
    }


    AttackBarChart.prototype.init = function (_data, _dispatch) {
        var self = this;

        var attackColor = require("allColors").getAttackColor();


        _data.sort(function(a, b) { return b.total - a.total; });

        height = 15*_data.length;

        svg.attr("height",height);


        var x = d3.scaleLinear()
            .range([0,width]);

        var z = d3.scaleOrdinal(d3.schemeCategory20);

        x.domain([0, d3.max(_data, function(d) {
                return d.total;
            })])
            .nice();
        z.domain(_data.columns.slice(1,_data.columns.length-1));

        var stackedbargroup = stackedbarchart.selectAll(".attackbarchart")
            .data(stack.keys(_data.columns.slice(1,_data.columns.length-1))(_data));

        stackedbargroup.exit().remove();

        stackedbargroup = stackedbargroup.enter().append("g").attr("class", "attackbarchart")
            .merge(stackedbargroup);


        stackedbargroup.attr("fill", function(d) {
            console.log(d);
            return attackColor[d.key];
        });


        var stackedbar = stackedbargroup.selectAll("rect")
            .data(function(d) {

                //console.log(d);
                d.forEach(function(s){
                    s["key"] = d.key;
                })
                return d;
            });

        stackedbar.exit().remove();


        stackedbar = stackedbar.enter().append("rect")
                        .merge(stackedbar);




        //console.log(stackedbar);
        stackedbar.attr("x",function(d) {d._x = x(d[0]); return x(d[0]); })
            .attr("y", function(d,i){ return i*(35+5);})
            .attr("height",35)
            .attr("width", function(d) { return x(d[1]) - x(d[0]); })


            //.on("mouseover",function(d){
            //    svg.selectAll("rect")
            //        .style("visibility",function(r){
            //            if(r.key != d.key){
            //                return "hidden";
            //            }
            //        })
            //        .attr("x", function(r){
            //            if(r.key == d.key){
            //                return 0;
            //            }
            //        })
            //})
            //.on("mouseout",function(d){
            //    svg.selectAll("rect")
            //        .style("visibility","visible")
            //        .attr("x", function(r){
            //            return r._x;
            //        })
            //});
    }

    return AttackBarChart.getInstance();
})