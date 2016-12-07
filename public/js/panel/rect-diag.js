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
    //var svg = d3.select("#rect-diag"),
    //    width = +svg.attr("width"),
    //    height = +svg.attr("height");





    var canvas = document.querySelector("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width,
        height = canvas.height,
        tau = 2 * Math.PI;

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


        d3.select("canvas").selectAll("*").remove();

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


        var nodes = [];
        for( var index = 0 ; index < links.length ; index++ ){
            nodes.push({r: scale(links[index].value)});
        }

        //console.log(nodes)

        var simulation = d3.forceSimulation(nodes)
            .velocityDecay(0.2)
            .force("x", d3.forceX().strength(0.002))
            .force("y", d3.forceY().strength(0.002))
            .force("collide", d3.forceCollide().radius(function(d) { return d.r + 0.5; }).iterations(2))
            .on("tick", ticked);


        function ticked() {
            context.clearRect(0, 0, width, height);
            context.save();
            context.translate(width / 2, height / 2);

            context.beginPath();
            nodes.forEach(function(d) {
                context.moveTo(d.x + d.r, d.y);
                context.arc(d.x, d.y, d.r, 0, tau);
            });
            context.fillStyle = "#ddd";
            context.fill();
            context.strokeStyle = "#333";
            context.stroke();

            context.restore();
        }

    }

    RectDiag.prototype.reload = function (links) {

        d3.select("canvas").selectAll("*").remove();

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


        var nodes = [];
        for( var index = 0 ; index < links.length ; index++ ){
            nodes.push({r: scale(links[index].value)});
        }

        var simulation = d3.forceSimulation(nodes)
            .velocityDecay(0.2)
            .force("x", d3.forceX().strength(0.002))
            .force("y", d3.forceY().strength(0.002))
            .force("collide", d3.forceCollide().radius(function(d) { return d.r + 0.5; }).iterations(2))
            .on("tick", ticked);


        function ticked() {
            context.clearRect(0, 0, width, height);
            context.save();
            context.translate(width / 2, height / 2);

            context.beginPath();
            nodes.forEach(function(d) {
                context.moveTo(d.x + d.r, d.y);
                context.arc(d.x, d.y, d.r, 0, tau);
            });
            context.fillStyle = "#ddd";
            context.fill();
            context.strokeStyle = "#333";
            context.stroke();

            context.restore();
        }
    }


    return RectDiag.getInstance();
})