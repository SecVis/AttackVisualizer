/**
 * Created by sunny on 12/6/16.
 */
define(["d3", "jquery", "randomColor"], function (d3, $, randomColor) {

    /**
     * This class is responsible for the modifiying the intruments
     * on the ui
     * @type {null}
     */

    var instance = null;

    var nodeColor= {};
    var linkColor = {};
    var attackColor = {};


    /**
     * 1. Check if instance is null then throw error
     * 2. Calls the load ui related to this class
     * @constructor
     */
    function AllColors() {
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
    AllColors.getInstance = function () {
        // gets an instance of the singleton. It is better to use
        if (instance === null) {
            instance = new AllColors();
        }
        return instance;
    };


    /**
     *
     * @param nodes
     * @param links
     */
    AllColors.prototype.init = function (nodes, links, attacks) {

        var self = this;
        attacks.forEach(function(attackName){
            attackColor[attackName] = randomColor();
        });

    }

    AllColors.prototype.getAttackColor = function () {

        var self = this;

        return attackColor;
    }

    return AllColors.getInstance();
});