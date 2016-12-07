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
    var svg = d3.select("#line-chart"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var attackBlockHeight = 100;
    var totalAttackCount = 0;

    var time_count = {};
    var time_count_arr = [];
    var k = 0;

    for(var i = 0; i<=23; i++){
        for(var j = 0; j<=59;j++){
            time_count[i*100+j] = k;
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


    /**
     *
     * @param nodes
     * @param links
     */
    LineChart.prototype.init = function (attackData,_dispatch) {

        var self = this;

        //console.log(attackData);
        self.totalAttackCount = d3.keys(attackData).length;
        svg.attr("height", self.totalAttackCount * attackBlockHeight);

        svg.selectAll("g").remove();

        var i = 0;
        for(var attack in attackData){
            var attackName = attack;
            var attackTimeList = attackData[attack].timelist;
            attackData[attack].time_count = time_count_arr.slice();
            var d = attackData[attack];
            for(var j in attackTimeList){
                var split_time = attackTimeList[j].split(":");
                var calc_time = parseInt(split_time[0])*100+parseInt(split_time[1]);
                var ndx = time_count[calc_time];
                d.time_count[ndx] += 1;
            }
            var attackTotalCount = attackData[attack].totalCount;

            //console.log(attackTotalCount);

            // if(attackTotalCount <= 510)
            //     continue;

            var max = d3.max(d.time_count,function(c){ return c;});

            var x = d3.scaleLinear().domain([0, time_count_arr.length]).range([40, width-40]);

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
                .attr("stroke","black")
                .attr("stroke-width","1.5");

            var yAxisLeft = d3.axisLeft().scale(y).ticks(4);
            // Add the y-axis to the left
            line_group.append("g")
                //.attr("class", "y-axis")
                .attr("transform", "translate(40,0)")
                .call(yAxisLeft);

            line_group.append("text")
                .text(attackName)
                .attr("y","10")
                .attr("x",-(attackBlockHeight/2)-5)
                .style("text-anchor", "middle")
                .attr("transform", "rotate(-90)");

            line_group.append("text")
                .text(attackName)
                .attr("y","10")
                .attr("x",-(attackBlockHeight/2)-5)
                .style("text-anchor", "middle");

            i++;
            // if(i == 5)
            //     break;

        }

        //console.log(attackData);

    }

    return LineChart.getInstance();
});