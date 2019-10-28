var d3 = require("d3");
var dot = require("@observablehq/graphviz");

var links = [
  {child: "a", parent: ""},
  {child: "b", parent: "a"},
  {child: "c", parent: "a"},
  {child: "d", parent: "a"},
  {child: "e", parent: "b"},
  {child: "f", parent: "c"},
  {child: "g", parent: "c"},
  {child: "h", parent: "d"},
  {child: "i", parent: "h"}
]

var columns = [
  "child",
  "parent"
]

var childColumn = columns[0];
var parentColumn = columns[1];

// console.log(links);
console.log(childColumn);
console.log(parentColumn);

stratify = d3
  .stratify()
  .id(d => d[childColumn])
  .parentId(d => d[parentColumn])

var root = stratify(links);

// console.log(root.data);
// console.log(root.id);
// console.log(root.parent);
// console.log(root.children);
// console.log(root.depth);
// console.log(root.height);
// console.log(root.children[0]);

// console.log(root);
// digraph(root);

function links2dot(links) {
  return links
    .map(l => {
      const target = l[columns[0]],
        source = l[columns[1]];
      if (source && target) return ` ${source} -> ${target} `;
    })
    .filter(d => d)
    .join("; ");
}

var result = links2dot(links);
// console.log(result);


// function graph(hierarchy, oriented) {
//   return dot`${graphsrc(hierarchy, oriented)}`;
// }
// function digraph(hierarchy) {
//   return graph(hierarchy, true);
// }






// we use a RunKit wrapper for d3:
var tonicD3 = require('tonic-d3');

// wrap our d3 code
var fn = tonicD3(function(data, svg, d3) {
    svg.selectAll('line')
        .data(data).enter()
        .append('line')
        .style('stroke', 'black')
        .attr('x1', function(d) { return d.x1; })
        .attr('x2', function(d) { return d.x2; })
        .attr('y1', function(d) { return d.y1; })
        .attr('y2', function(d) { return d.y2; });
})

// render out to the notebook
fn([
  {
    x1: 0,
    x2: 100,
    y1: 100,
    y2: 300
  },
    {
    x1: 100,
    x2: 0,
    y1: 100,
    y2: 300
  }
]);

