// init-map
const map = L.map('map').setView([53.9624, -1.0819], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// insert data
let facilities = {}; // store all data

async function loadData() {
    //insert GeoJson fm Github
    const types = ['libraries', 'hositpitals', 'pharmacies', 'roads'];
    
    for (const type of types) {
        const response = await fetch(`data/${type}.geojson`);
        facilities[type] = await response.json();
    }
}

// onclick event -on map
map.on('click', async (e) => {
    const clickedPoint = turf.point([e.latlng.lng, e.latlng.lat]);
    const results = document.getElementById('results');
    
    // 1. find the postcode
    // const postcode = findPostcode(clickedPoint);
    
    // 2. find public transport
    const nearestStation = findNearest(clickedPoint, facilities['stations'], 'walking');
    const nearestBusStop = findNearest(clickedPoint, facilities['bus_stops'], 'walking');
    
    // 3. find road, highway, etc...
    const nearestRoad = findNearest(clickedPoint, facilities['roads'], 'driving');
    
    // result
    results.innerHTML = `
        <h3>Result</h3>
        <p><strong>location:</strong> ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}</p>
        <p><strong>The nearest Station :</strong> ${nearestStation.properties.name} (walk ${nearestStation.time}mins)</p>
        <p><strong>The nearest bus stop:</strong> ${nearestBusStop.properties.name} (walk${nearestBusStop.time}mins)</p>
        <p><strong>The nearest highway:</strong> ${nearestRoad.properties.name} (drive${nearestRoad.time}mins)</p>
    `;
});

function findNearest(point, features, mode) {
    let nearest = null;
    let minDistance = Infinity;
    
    // Run Turf.js to find the nearest 
    for (const feature of features.features) {
        const distance = turf.distance(point, feature, {units: 'kilometers'});
        if (distance < minDistance) {
            minDistance = distance;
            nearest = feature;
        }
    }
    
    // estimate (speed of walk: 5km/h, spped of drive: 30km/h)
    const speed = mode === 'walking' ? 5 : 30;
    const time = Math.round((minDistance / speed) * 60);
    
    return {
        ...nearest,
        distance: minDistance,
        time: time
    };
}

// init
loadData();
