/**
 * Created by sunny on 12/1/16.
 */
requirejs.config({
    //waitSeconds: 100,
    paths:{
        "line-chart": "panel/line-chart",
        "randomColor": "../../bower_components/randomcolor/randomColor",
        "jquery": "../../bower_components/jquery/dist/jquery.min",
        "bootstrap": "../../bower_components/bootstrap/dist/js/bootstrap.min",
        "colorbrewer": "../../bower_components/colorbrewer/colorbrewer",
        "d3": "../../bower_components/d3/d3.min",
        "d3-tip": "../../bower_components/d3-tip/index",
        "node-link": "panel/node-link",
        "load-data": "data/load-data",
        "rect-diag": "panel/rect-diag",
        "hourly-map": "panel/hourly-map",
        "read-menu" : "data/read-menu",
        "allColors": "data/allColors",
        "attack-bar-chart-2": "panel/attack-bar-chart-2",
        "legend": "panel/attacklegend",
        "tooltip": "data/tooltip"
    },
    shim: {
        //"d3-dsv":["d3"]
        // "tip":["d3-tip"]
        //"attack-bar-chart":["allColors"]
    }
});


require(["load-data","read-menu","tooltip"], function (loaddata,readMenu,tooltip) {
    readMenu.init();
    tooltip.init();
    loaddata.init("../data/tcpdump.csv");
});