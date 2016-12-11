/**
 * Created by sunny on 12/2/16.
 */
define(["d3", "jquery", "tooltip"], function (d3, $, tooltip) {

    /**
     * This class is responsible for the modifiying the intruments
     * on the ui
     * @type {null}
     */

    var instance = null;
    var svg = d3.select("#line-chart"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var attackBlockHeight = 100;
    var totalAttackCount = 0;

    var time_count = {};
    var rev_time_count = {};
    var time_count_arr = [];
    var k = 0;

    for(var i = 0; i<=23; i++){
        for(var j = 0; j<=59;j++){
            time_count[i*100+j] = k;
            rev_time_count[k] = i*100+j;
            time_count_arr.push(0);
            ++k;
        }
    }


    /**
     * 1. Check if instance is null then throw error
     * 2. Calls the load ui related to this class
     * @constructor
     */
    function LineChart() {
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
    LineChart.getInstance = function () {
        // gets an instance of the singleton. It is better to use
        if (instance === null) {
            instance = new LineChart();
        }
        return instance;
    };

    LineChart.prototype.getTimeFormat = function(value){
        var text = "";
        var rem = value%100;
        var div = parseInt(value/100);
        if(rem >=0  && rem <=9 ){
            text += ":0"+rem.toString();
        }
        else{
            text += ":"+rem.toString();
        }
        if(div >= 0  && div <= 9){
            text = "0"+div.toString() + text;
        }else{
            text = div.toString() + text;
        }
        return text;
    }
    /**
     *
     * @param nodes
     * @param links
     */
    LineChart.prototype.init = function (attackData,_dispatch) {

        var self = this;

        var tip = tooltip.getToolTip();

        svg.call(tip);

        var attackColor = require("allColors").getAttackColor();

        //console.log(attackData);
        self.totalAttackCount = d3.keys(attackData).length;
        svg.attr("height", self.totalAttackCount * (attackBlockHeight+15));

        height = self.totalAttackCount * (attackBlockHeight+15);

        svg.selectAll("g").remove();

        var data = d3.entries(attackData);

        //console.log(data);

        data.sort(function(a,b){
            return d3.descending(a.value["totalCount"],b.value["totalCount"]);
        });

        var x = d3.scaleLinear().domain([0, time_count_arr.length]).range([40, width-40]);

        var i = 0;
        for(var n = 0; n<data.length; n++){
            var attackName = data[n].key;
            var attackTimeList = data[n].value.timelist;
            data[n].value.time_count = time_count_arr.slice();
            var d = data[n].value;
            for(var j in attackTimeList){
                var split_time = attackTimeList[j].split(":");
                var calc_time = parseInt(split_time[0])*100+parseInt(split_time[1]);
                var ndx = time_count[calc_time];
                d.time_count[ndx] += 1;
            }
            var attackTotalCount = data[n].value.totalCount;

            //console.log(attackTotalCount);

            // if(attackTotalCount <= 510)
            //     continue;

            var max = d3.max(d.time_count,function(c){ return c;});

            var y = d3.scaleLinear().domain([0, max]).range([attackBlockHeight, 0]);

            var line = d3.line()
                .x(function(d,i) {
                    return x(i);
                })
                .y(function(d) {
                    return y(d);
                })

            var line_group = svg.append("g").attr("id",attackName)
                .attr("transform","translate(0,"+(i*(attackBlockHeight+15)+5)+")");

            line_group.append("path")
                .attr("d", line(d.time_count))
                .attr("fill","none")
                .attr("stroke",attackColor[attackName])
                .attr("stroke-width","2.5");

            var yAxisLeft = d3.axisLeft().scale(y).ticks(4);
            // Add the y-axis to the left
            line_group.append("g")
                //.attr("class", "y-axis")
                .attr("transform", "translate(40,0)")
                .call(yAxisLeft);

            line_group.append("text")
                .text(attackName)
                .attr("fill",attackColor[attackName])
                .attr("y","10")
                .attr("x",-(attackBlockHeight/2)-5)
                .style("text-anchor", "middle")
                .attr("transform", "rotate(-90)");

            line_group.append("text")
                .text(attackTotalCount)
                .attr("fill",attackColor[attackName])
                .attr("x",(width-20))
                .attr("y",(attackBlockHeight/2))
                .style("text-anchor", "middle");

            i++;
            // if(i == 5)
            //     break;

        }

        svg.on("mouseover",function() {
            var coord = d3.mouse(this);
            if (coord[0] >= 40 && coord[0] <= width - 40) {
                svg.append("rect").classed("indicator", true).attr("height", height)
                    .attr("width", 1).attr("fill", "black")
                    .attr("x", coord[0]);

                tip.offset([coord[1],0]);
                tip.show(self.getTimeFormat(rev_time_count[x.invert(coord[0]).toFixed(0)]));
            }
        })
            .on("mousemove",function(){
                var coord = d3.mouse(this);
                if (coord[0] >= 40 && coord[0] <= width - 40) {
                    svg.select(".indicator")
                        .attr("x", coord[0]);
                    tip.offset([coord[1],0]);
                    tip.show(self.getTimeFormat(rev_time_count[x.invert(coord[0]).toFixed(0)]));
                }else{
                    svg.select(".indicator").remove();
                    tip.hide();
                }
            })
            .on("mouseout",function(){
                svg.select(".indicator").remove();
                tip.hide();
            });

    }

    return LineChart.getInstance();
});