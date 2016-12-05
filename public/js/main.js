/**
 * Created by sunny on 12/1/16.
 */
requirejs.config({
    waitSeconds: 100,
    paths:{
        "jquery": "../../bower_components/jquery/dist/jquery.min",
        "bootstrap": "../../bower_components/bootstrap/dist/js/bootstrap.min",
        "colorbrewer": "../../bower_components/colorbrewer/colorbrewer",
        //"d3-dsv": "../../bower_components/d3-dsv/index",
        "d3": "../../bower_components/d3/d3.min",
        "d3-tip": "../../bower_components/d3-tip/index",
        "node-link": "../../public/js/panel/node-link",
        "load-data": "../../public/js/data/load-data"
    },
    shim: {
        //"d3-dsv":["d3"]
        //"d3":["d3-dsv"]
    }
});

require(["load-data"], function (loaddata) {
    loaddata.init("../../")
});