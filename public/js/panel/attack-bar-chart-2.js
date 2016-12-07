/**
 * Created by sunny on 12/6/16.
 */
define(["d3","tooltip"],function(d3, tooltip){


    /**
     * This class is responsible for the modifiying the intruments
     * on the ui
     * @type {null}
     */

    var instance = null;
    var svg = d3.select("#attack-bar-chart"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var zsvg = d3.select("#attack-bar-chart-zoom"),
        zwidth = +svg.attr("width"),
        zheight = +svg.attr("height");

    var dispatch;




    /**
     * 1. Check if instance is null then throw error
     * 2. Calls the load ui related to this class
     * @constructor
     */
    function AttackBarChart2() {
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
    AttackBarChart2.getInstance = function () {
        // gets an instance of the singleton. It is better to use
        if (instance === null) {
            instance = new AttackBarChart2();
        }
        return instance;
    };

    /**
     *
     * @param _data
     */
    AttackBarChart2.prototype.zoom = function (d, ip) {

        zsvg.append("text").attr("y",225).style("font-size","30px").style("stroke","black").text(ip);
        var attack = zsvg.selectAll("rect").data(function(){
            return d3.entries(d.attacks);
        })
        attack.exit().remove();
        attack = attack.enter().append("rect").merge(attack);
        attack.attr("y",250)
            .attr("x",function(d){
                return d.value.x;
            })
            .attr("width",function(d){
                return d.value.width;
            })
            .attr("height",50)
            .style("fill",function(d){
                return d.value.color;
            })
    }



    /**
     *
     * @param _data
     */
    AttackBarChart2.prototype.reload = function (_data) {
        var self = this;

        var tip = tooltip.getToolTip();
        console.log(tip)
        svg.call(tip);

        var colorMap = require("allColors").getAttackColor();
        for(var ip in _data){
            var ipobj = _data[ip];
            var attacks = ipobj.attacks;
            var xLoc = 0;
            var scale = d3.scaleLinear().domain([0,ipobj.totalCount]).range([0,width]);
            for(var aIndex in _data[ip].attacks){
                _data[ip].attacks[aIndex].x = xLoc;
                _data[ip].attacks[aIndex].width = scale(_data[ip].attacks[aIndex].value)
                _data[ip].attacks[aIndex].color = colorMap[aIndex];
                _data[ip].attacks[aIndex].id = ip;
                xLoc += _data[ip].attacks[aIndex].width
            }
        }


        //filter all the entries which contain ip address
        //along with rectangular bar width
        var entries = d3.entries(_data);
        entries.sort(function(a,b){
            return d3.descending(a.value.totalCount,b.value.totalCount);
        });


        var group = svg.selectAll("g").data(entries);
        group.exit().remove();
        group = group.enter().append("g").merge(group);
        group.attr("transform",function(d,i){
            return "translate(0,"+i*1+")";
        })

        var attack = group.selectAll("rect").data(function(d){

            return d3.entries(d.value.attacks);
        })
        attack.exit().remove();
        attack = attack.enter().append("rect").merge(attack);
        attack.attr("x",function(d){
            return d.value.x;
        })
        .attr("width",function(d){
            return d.value.width;
        })
        .attr("height",1)
        .style("cursor","zoom-in")
        .style("fill",function(d){
            return d.value.color;
        })
        .on("click",function(d){
            dispatch.call("attackBarChartClickCallBack",{},d);
        })
        .on("mouseover",function(d){
            self.zoom(_data[d.value.id], d.value.id);
            console.log(d.value)
            var message = "<strong>Attack - "+ d.key+" :</strong> <span style='color:red'>" + d.value.value + "</span>"
            tip.show(message);
        })
        .on("mouseout",function(d){
            zsvg.selectAll("*").remove();
        })

        svg.attr("height",entries.length*1);

    }


    AttackBarChart2.prototype.init = function (_data, _dispatch) {
        var self = this;

        dispatch = _dispatch;

        //call the reload function with the data
        self.reload(_data);
    }

    return AttackBarChart2.getInstance();
})