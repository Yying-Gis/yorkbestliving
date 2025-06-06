//setup city center 
// change to get the data from python in future
const map = L.map('map').setView([53.9489329262296, -1.082735799204503], 13);

// add openStrretMap as a basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);


//add scale control
//L.control.scale({imperial: false}).addTo(map);