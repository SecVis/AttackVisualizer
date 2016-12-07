/**
 * Created by nishantagarwal on 12/6/16.
 */
define(["d3","load-data"],function(d3,loaddata){


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
    function ReadMenu() {
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
    ReadMenu.getInstance = function () {
        // gets an instance of the singleton. It is better to use
        if (instance === null) {
            instance = new ReadMenu();
        }
        return instance;
    };

    /**
     *
     * @param _data
     */
    ReadMenu.prototype.init = function (_data) {
       var self = this;

       var day = ["monday","tuesday","wednesday","thursday","friday"];
       var list = d3.select(".sidebar-nav").selectAll("li").selectAll("a");

       list.on("click",function(){
           var filepath = "../data/2week/"
           if(this.id >= 11 && this.id<=15) {
               var folder = day[(this.id%10)-1];
               filepath += folder+"/both.llist";
               loaddata.init(filepath);
           }else if(this.id >= 21 && this.id <= 25){
               var folder = day[(this.id%10)-1];
               filepath += folder+"/both.llist";
               loaddata.init(filepath);
           }else{

           }

       })
    }

    return ReadMenu.getInstance();
})