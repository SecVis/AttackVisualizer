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





    //var canvas = document.querySelector("canvas"),
    //    context = canvas.getContext("2d"),
    //    width = canvas.width,
    //    height = canvas.height,
    //    tau = 2 * Math.PI;
    var dispatch;

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
    RectDiag.prototype.init = function (links, dispatch) {

        var self = this;

        self.dispatch = dispatch;
        console.log(dispatch)
        self.reload(links);

    }

    RectDiag.prototype.reload = function (links) {

        var self = this;

        d3.select("#rect-diag").selectAll("*").remove();


        var dataset = {
            "children": []
        };

        var largestVal = Number.MIN_VALUE;
        var smallestVal = Number.MAX_VALUE;

        for(var index = 0; index < links.length ; index++){
            if(largestVal < links[index].value){
                largestVal = links[index].value
            }
            if(smallestVal > links[index].value){
                smallestVal = links[index].value
            }
        }

        var scale = d3.scaleLinear()
            .domain([smallestVal, largestVal])
            .range([3, 50]);


        for( var index = 0 ; index < links.length ; index++ ){
            dataset.children.push({
                "link":links[index],
                "responseCount": scale(links[index].value)
            });
        }

        //var diameter = 600;
        var color = d3.scaleOrdinal(d3.schemeCategory20);
        var bubble = d3.pack(dataset)
            .size([svg.attr("width"), svg.attr("height")])
            .padding(1.5);
        svg.attr("class", "bubble");

        var nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.responseCount; });

        var node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        //
        node.append("circle")
            .classed("rect-diag-link",true)
            .attr("r", function(d) {
                return d.r;
            })
            .on("click",function(d){
                svg.selectAll("circle").style("fill","lightgrey");
                d3.select(this).style("fill","green");
                self.dispatch.call("rectDiagCallBack",{}, d.data.link);
            });


        d3.select(self.frameElement)
            .style("height", svg.attr("height") + "px");

    }


    return RectDiag.getInstance();
})