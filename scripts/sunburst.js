var nodeData = {
    "name": "TOPICS", "children": [
        {
            "name": "TOPIC A", "children": [
                { "name": "Sub A1", "size": 4 }, { "name": "Sub A2", "size": 4 }
            ]
        },
        {
            "name": "TOPIC B", "children": [
                { "name": "Sub B1", "size": 3 }, { "name": "Sub B2", "size": 3 }, { "name": "Sub B3", "size": 3 }
            ]
        },
        {
            "name": "TOPIC C", "children": [
                { "name": "Sub C1", "size": 4 }, { "name": "Sub C2", "size": 4 }
            ]
        }
    ]
}

const iHeight = 500, iWidth = 500;
const iRadius = Math.min(iWidth, iHeight) / 2;

//1. Fetch a rainbow range of colors
var color = d3.scaleOrdinal(d3.schemeSet1);

//2. Set up svg workspace
var canvas = d3.select('svg')
    .attr('width', iWidth)
    .attr('height', iHeight);

var parentGroup = canvas.append('g')
    .attr('transform', `translate(${iRadius},${iRadius})`);

//3. Create the structure for hierarchial viz

//partition allows to organize data for sunburst pattern
//We tell d3 how big our sunburst is (math.PI * 2)
//and distance from center to outside of sunburst(radius)
var partition = d3.partition().size([Math.PI * 2, iRadius]);

//4.  Find the root node

//.hierarchy organises the data in a hierarchial manner
//.sum ierates through all nodes and assigns value attr to each node
//value attr is sum of size prop of node's children or its sibling
var hierarchialData = d3.hierarchy(nodeData).sum(d => { return d.size; });

//5. Calculate each arc

partition(hierarchialData);

//Get the start,end angles and inner radius and outer radius
var arc = d3.arc()
    .startAngle(d => {
        return d.x0;
    })
    .endAngle(d => {
        return d.x1;
    })
    .innerRadius(d => {
        return d.y0;
    })
    .outerRadius(d => {
        return d.y1;
    });

///6. Render the sunburst

//create path elements for each node in order of hierarchial data
parentGroup.selectAll('path')
    //returns hierarchy data in array form
    .data(hierarchialData.descendants())
    .enter()
    .append('path')
    // depth calculated as distance of each node from center
    .attr('display', d => { return d.depth ? null : 'none'; })
    .attr('d', arc)
    .style('stroke', '#fff')
    .style("fill", d => {
        return color((d.children ? d : d.parent).data.name);
    });