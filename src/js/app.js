(function() {
  const margin = { top: 50, left: 50, bottom: 50, right: 50 }
  const height = 400 - margin.top - margin.bottom
  const width = 800 - margin.left - margin.right

  const svg = d3.select('#map')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${ margin.left }, ${ margin.top })`)

  // make dropshadow
  const defs = svg.append('defs')

  const dropShadowFilter = defs.append('svg:filter')
    .attr('id', 'drop-shadow')
    .attr('filterUnits', 'userSpaceOnUse')
    .attr('width', '250%')
    .attr('height', '250%')

  dropShadowFilter.append('svg:feGaussianBlur')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', 2)
    .attr('result', 'blur-out')

  dropShadowFilter.append('svg:feColorMatrix')
    .attr('in', 'blur-out')
    .attr('type', 'hueRotate')
    .attr('values', 180)
    .attr('result', 'color-out')

  dropShadowFilter.append('svg:feOffset')
    .attr('in', 'color-out')
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('result', 'the-shadow')

  dropShadowFilter.append('svg:feBlend')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'the-shadow')
    .attr('mode', 'normal')

  // Read in world-countries.json and capitals.csv
  d3.queue()
    .defer(d3.json, 'data/world-countries.json')
    .defer(d3.csv, 'data/capitals.csv')
    .await(ready)

  // Create a new projection using Mercator
  const projection = d3.geoMercator()
    .translate([ width / 2, height / 2 ])
    .scale(100)

  // Create a path
  const path = d3.geoPath()
    .projection(projection)

  function ready(error, data, capitals) {
    const countries = topojson.feature(data, data.objects.countries1).features

    // draw country
    svg.selectAll('.country')
      .data(countries)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)

    // add selected city
    svg.selectAll('.city-circle')
      .data(capitals)
      .enter()
      .append('circle')
      .attr('class', 'city-circle')
      .attr('r', 3)
      .attr('cx', function(d) {
        const coords = projection([ d.long, d.lat ])

        return coords[0]
      })
      .attr('cy', function(d) {
        const coords = projection([ d.long, d.lat ])

        return coords[1]
      })
      .style('filter', 'url(#drop-shadow)')

    // add selected city label
    // svg.selectAll('.city-label')
    //   .data(capitals)
    //   .enter()
    //   .append('text')
    //   .attr('class', 'city-label')
    //   .attr('x', function(d) {
    //     const coords = projection([ d.long, d.lat ])

    //     return coords[0]
    //   })
    //   .attr('y', function(d) {
    //     const coords = projection([ d.long, d.lat ])

    //     return coords[1]
    //   })
    //   .text(function(d) {
    //     return d.name
    //   })
    //   .attr('dx', 10)
    //   .attr('dy', 2)
  }
})()
