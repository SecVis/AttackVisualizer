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
    var nodeLinkSVG = d3.select("#node-link"),
        width = +nodeLinkSVG.attr("width"),
        height = +nodeLinkSVG.attr("height");
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    /**
     *
     * @param d
     */
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    /**
     *
     * @param d
     */
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    /**
     *
     * @param d
     */
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    /**
     *
     * @param a
     * @param b
     * @returns {number}
     */
    function compare(a, b) {
        if (a.value < b.value)
            return 1;
        if (a.value > b.value)
            return -1;
        return 0;
    }

    /**
     * 1. Check if instance is null then throw error
     * 2. Calls the load ui related to this class
     * @constructor
     */
    function NodeLink() {
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
    NodeLink.getInstance = function () {
        // gets an instance of the singleton. It is better to use
        if (instance === null) {
            instance = new NodeLink();
        }
        return instance;
    };


    /**
     *
     * @param nodes
     * @param links
     */
    NodeLink.prototype.init = function (nodes, links) {
        var self = this;

        nodeLinkSVG.append("rect").attr("width", width)
            .attr("height", height)
            .style("fill", "white")
            .on("click", function () {

                links = [];
                nodes = [];

                for (var src in linkVal) {
                    for (var dest in linkVal[src]) {
                        var val = linkVal[src][dest];

                        links.push({value: val, source: src, target: dest})
                    }
                }

                for (var key in nodesmap) {
                    nodes.push({id: nodesmap[key], group: 1});
                }

                //plot(nodes,links);
                self.plotNodeLink(links);
            });

        self.group = nodeLinkSVG.append("g");
        self.plotNodeLink(nodes, links);

    }

    /**
     *
     * @param nodes
     * @param links
     */
    NodeLink.prototype.plotNodeLink = function (nodes, links) {
        var self = this;

        self.group.selectAll("*").remove();

        var link = self.group.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", function (d) {
                return Math.sqrt(d.value);
            })
            .on("click", function (d) {

                var new_nodes = [];
                nodes.forEach(function (node) {
                    if (node.id == d.source.id || node.id == d.target.id) {
                        new_nodes.push(node)
                    }
                })

                var new_links = [];
                links.forEach(function (link) {
                    if (link.source.id == d.source.id && link.target.id == d.target.id) {
                        new_links.push(link);
                    }
                })
                //
                //plot(new_nodes, new_links, 1);
                //plot_links(links);
            });

        var node = self.group.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", function () {
                return 5;
            })
            .attr("fill", function (d) {
                return color(d.group);
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on("click", function (d) {

                var new_links = [];
                var selected_nodes = [];
                links.forEach(function (link) {
                    if (link.source.id == d.id) {
                        new_links.push(link);
                        selected_nodes.push(link.source.id);
                        selected_nodes.push(link.target.id);
                    }
                })

                var new_nodes = [];
                nodes.forEach(function (node) {
                    if (-1 != $.inArray(node.id, selected_nodes)) {
                        new_nodes.push(node)
                    }
                })

                self.plotNodeLink(new_nodes, new_links);
            });


        node.append("title")
            .text(function (d) {
                return d.id;
            });

        simulation
            .nodes(nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(links);

        function ticked() {
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            node
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
        }
    }
    return NodeLink.getInstance();
});