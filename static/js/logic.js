// Set GeoJSON url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Set map object
let myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 3
});

let topographMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Function for marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 50000; // adjust this as needed
}

//Function for marker color based on depth
function depthColor(depth) {
  return depth > 100 ? '#800026' :
         depth > 70  ? '#BD0026' :
         depth > 50  ? '#E31A1C' :
         depth > 30  ? '#FC4E2A' :
         depth > 10  ? '#FD8D3C' :
         depth > -10 ? '#FEB24C' :
                       '#FED976'; // for depths less than -10
}

//Use d3.json to load data
d3.json(url).then(function(data) {
  let earthquakes = data.features;

  // Loop through the earthquakes, create one marker for each earthquake.
  for (let i = 0; i < earthquakes.length; i++) {

    // Add circles to map
    L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: "white",
      fillColor: depthColor(earthquakes[i].geometry.coordinates[2]),
      // Adjust the radius according to the earthquake's magnitude.
      radius: markerSize(earthquakes[i].properties.mag)
    }).bindPopup(`<h1>${earthquakes[i].properties.place}</h1> <hr> <h3>Magnitude: ${earthquakes[i].properties.mag}</h3> <h3>Depth: ${earthquakes[i].geometry.coordinates[2]}</h3>`).addTo(myMap);
  }
});

//Define legend
let legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90, 100],  // depth levels for the legend
        labels = [];

    //Loop through depths, make a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+') + '<br>';
    }

    return div;
};

// Add legend to map
legend.addTo(myMap);

// Function for assigning color depending on depth
function getColor(d) {
    return d > 90 ? '#800026' :
           d > 70  ? '#BD0026' :
           d > 50  ? '#E31A1C' :
           d > 30  ? '#FC4E2A' :
           d > 10  ? '#FD8D3C' :
           d > -10   ? '#FEB24C' :
                      '#FED976';
}
