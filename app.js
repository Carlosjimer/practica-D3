const { json, select, selectAll, geoOrthographic, geoPath } = d3;

let geojson, globe, projection, path, infoPanel, isMouseDown = false, rotation = {x: 0, y: 0};

const globeSize = {
    w: innerWidth / 2,
    h: innerHeight
}

json('custom.geo.json').then(data => init(data));

const init = data => {
    geojson = data;
    drawGlobe()
    renderInfoPanel()
    createHoverEffect()
    createDraggingefect()
}

const drawGlobe = () => {
    globe = select('body')
        .append('svg')
        .attr('height', window.innerHeight)
        .attr('width', window.innerWidth)
    
    projection = geoOrthographic()
        .fitSize([globeSize.w, globeSize.h], geojson)
        .translate([window.innerWidth - globeSize.w / 2, window.innerHeight / 2])

    path = geoPath().projection(projection)

    globe
    .selectAll('path')
    .data(geojson.features)
    .enter().append('path')
    .attr('d', path)
    .style('fill', 'rgb(250, 250, 250)')
    .style('stroke', 'rgb(41, 188, 253)')
    .attr('class', 'country')

};
const renderInfoPanel = () => infoPanel = select('body').append('article').attr('class','info')

const createHoverEffect = () => {
    globe
        .selectAll('.country')
        .on('mouseover', function(e, d){
            const {formal_en, economy} = d.properties
            infoPanel.html(`<h1>${formal_en}</h1><hr><p>${economy}</p>`)
            globe.selectAll('.country').style('fill','white')
            select(this).style('fill','#40f2fe')
        })
}

const createDraggingefect = () => {
    globe
        .on('mousedown', () => isMouseDown = true)
        .on('mouseup',() => isMouseDown = false)
        .on('mousemove', e => {

            if(isMouseDown === true){

            const {movementX, movementY} = e

            rotation.x += movementX / 2
            rotation.y -= movementY / 2

            projection.rotate([rotation.x,  rotation.y])
            selectAll('.country').attr('d', path)
            }
        })
}