/**
 * Created by sunny on 12/5/16.
 */
define(["d3"],function(d3){


    /**
     * This class is responsible for the modifiying the intruments
     * on the ui
     * @type {null}
     */

    var instance = null;
    var svg = d3.select("#rect-diag"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var bar_width = 250;

    /**
     * 1. Check if instance is null then throw error
     * 2. Calls the load ui related to this class
     * @constructor
     */
    function RectDiag() {
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
    RectDiag.getInstance = function () {
        // gets an instance of the singleton. It is better to use
        if (instance === null) {
            instance = new RectDiag();
        }
        return instance;
    };

    /**
     *
     * @param _data
     */
    RectDiag.prototype.init = function (links) {

        var svgHeight = 0;
        var links = svg.selectAll("rect").data(links);
        var rectangle = links.enter().append("rect").merge(links);

        rectangle.attr("height",function(d){
                svgHeight += (d.height + 3);
                return d.height;
            })
            .attr("width",bar_width)
            .attr("x",20)
            .attr("y",function(d){
                return d.yIndex;
            })
            //.attr("rx",20)
            //.attr("ry",20)
            .style("stroke","black")
            .style("stroke-width","2")
            //.on("mouseover",function(d){
            //    group.selectAll("line")
            //        .style("stroke",function(link){
            //            if(d.source.id == link.source.id && d.target.id == link.target.id){
            //                return "red";
            //            }
            //        })
            //        .style("stroke-opacity",function(link){
            //            if(d.source.id == link.source.id && d.target.id == link.target.id){
            //                return 1;
            //            }
            //        });
            //})

        svg.attr("height",svgHeight + 10);
    }

    RectDiag.prototype.reload = function (links) {

        svg.selectAll("rect").remove();

        var svgHeight = 0;
        var links = svg.selectAll("rect").data(links);
        var rectangle = links.enter().append("rect").merge(links);

        rectangle.attr("height",function(d){
                svgHeight += (d.height + 10);
                return d.height;
            })
            .attr("width",bar_width)
            .attr("x",20)
            .attr("y",function(d){
                return d.yIndex;
            })
            //.attr("rx",20)
            //.attr("ry",20)
            .style("stroke","black")
            .style("stroke-width","2")
        //.on("mouseover",function(d){
        //    group.selectAll("line")
        //        .style("stroke",function(link){
        //            if(d.source.id == link.source.id && d.target.id == link.target.id){
        //                return "red";
        //            }
        //        })
        //        .style("stroke-opacity",function(link){
        //            if(d.source.id == link.source.id && d.target.id == link.target.id){
        //                return 1;
        //            }
        //        });
        //})

        svg.attr("height",svgHeight + 10);
    }


    return RectDiag.getInstance();
})