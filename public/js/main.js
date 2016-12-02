/**
 * Created by sunny on 12/1/16.
 */
requirejs.config({
    waitSeconds: 100,
    paths:{
        "jquery": "../../bower_components/jquery/dist/jquery.min",
        "bootstrap": "../../bower_components/bootstrap/dist/js/bootstrap.min",
        "colorbrewer": "../../bower_components/colorbrewer/colorbrewer",
        "d3": "../../bower_components/d3/d3",
        "d3-tip": "../../bower_components/d3-tip/index",
        "d3-word-cloud": "../../public_html/js/view/mainPanel/wordGraph/d3.layout.cloud"
    },
    shim: {
        "d3-tip":["d3"],
        "d3-word-cloud":["d3"]
    }
});

require(["d3"],
    function (d3) {
        d3.csv("../data/tcpdump.csv",function(d){

        });
    });