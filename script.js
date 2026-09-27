/* ============================================================
   INTERACTIVE WEB GIS OF PAKISTAN
   Data + map logic. Edit the arrays below to customize content.
   ============================================================ */
 
// ---------- 1. DATA: GIS LAYER — CITIES (Name, Province, Type) ----------
const cities = [
  ["Islamabad","Islamabad Capital Territory","National Capital",33.6844,73.0479],
  ["Karachi","Sindh","Metropolitan",24.8607,67.0011],
  ["Lahore","Punjab","Metropolitan",31.5497,74.3436],
  ["Faisalabad","Punjab","Industrial City",31.4504,73.1350],
  ["Rawalpindi","Punjab","City",33.5651,73.0169],
  ["Multan","Punjab","City",30.1575,71.5249],
  ["Peshawar","Khyber Pakhtunkhwa","Provincial Capital",34.0151,71.5805],
  ["Quetta","Balochistan","Provincial Capital",30.1798,66.9750],
  ["Sialkot","Punjab","Industrial City",32.4945,74.5229],
  ["Gujranwala","Punjab","City",32.1877,74.1945],
  ["Hyderabad","Sindh","City",25.3960,68.3578],
  ["Sukkur","Sindh","City",27.7052,68.8574],
  ["Bahawalpur","Punjab","City",29.4000,71.6833],
  ["Abbottabad","Khyber Pakhtunkhwa","Hill City",34.1463,73.2117],
  ["Gilgit","Gilgit-Baltistan","City",35.9208,74.3144],
  ["Muzaffarabad","Azad Jammu & Kashmir","Regional Capital",34.3700,73.4711]
];
 
// ---------- 2. DATA: GIS LAYER — WEATHER STATIONS (Station, Temp °C, Rainfall mm) ----------
const stations = [
  ["Islamabad WS",28,90,33.72,73.09],
  ["Karachi WS",32,20,24.90,67.05],
  ["Lahore WS",30,60,31.58,74.40],
  ["Peshawar WS",29,45,34.06,71.62],
  ["Quetta WS",22,15,30.22,67.02],
  ["Multan WS",34,10,30.20,71.57],
  ["Faisalabad WS",31,55,31.49,73.18],
  ["Hyderabad WS",33,25,25.44,68.40],
  ["Sukkur WS",35,12,27.75,68.90],
  ["Gilgit WS",18,100,35.96,74.36],
  ["Skardu WS",15,80,35.30,75.63],
  ["Chitral WS",20,120,35.85,71.79],
  ["Zhob WS",24,30,31.34,69.45],
  ["Turbat WS",33,8,26.00,63.04],
  ["Muzaffarabad WS",26,140,34.42,73.52]
];
 
// ---------- 3. MAP INIT ----------
const map = L.map('map',{zoomControl:true, worldCopyJump:true}).setView([30.3753,69.3451],5.4);
 
// ---------- 4. BASEMAPS (5 different tile sources) ----------
const basemaps = {
  "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19, attribution:'&copy; OpenStreetMap contributors'
  }),
  "Satellite (Esri)": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{
    maxZoom:19, attribution:'Tiles &copy; Esri, Maxar, Earthstar Geographics'
  }),
  "Terrain (OpenTopoMap)": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',{
    maxZoom:17, attribution:'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
  }),
  "Light (Carto Positron)": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{
    maxZoom:19, attribution:'&copy; OpenStreetMap contributors &copy; CARTO'
  }),
  "Dark (Carto Dark Matter)": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
    maxZoom:19, attribution:'&copy; OpenStreetMap contributors &copy; CARTO'
  })
};
let activeBasemapName = "OpenStreetMap";
basemaps[activeBasemapName].addTo(map);
 
// ---------- 5. MARKER SYMBOLS ----------
const cityIcon = L.divIcon({className:'', html:'<div style="font-size:20px;">🏙</div>', iconSize:[22,22], iconAnchor:[11,20]});
const stationIcon = L.divIcon({className:'', html:'<div style="font-size:18px;">☔</div>', iconSize:[20,20], iconAnchor:[10,18]});
 
// ---------- 6. OVERLAY LAYERS + POPUPS (attributes) ----------
const cityLayer = L.layerGroup(cities.map(([name,province,type,lat,lng])=>
  L.marker([lat,lng],{icon:cityIcon}).bindPopup(
    `<div class="popup-title">${name}</div>
     <div class="popup-row">Province: ${province}</div>
     <div class="popup-row">Type: ${type}</div>`
  )
));
 
const stationLayer = L.layerGroup(stations.map(([name,temp,rain,lat,lng])=>
  L.marker([lat,lng],{icon:stationIcon}).bindPopup(
    `<div class="popup-title">${name}</div>
     <div class="popup-row">Temperature: ${temp}°C</div>
     <div class="popup-row">Rainfall: ${rain} mm</div>`
  )
));
 
const overlays = {
  [`Cities (${cities.length})`]: cityLayer,
  [`Weather Stations (${stations.length})`]: stationLayer
};
cityLayer.addTo(map);
stationLayer.addTo(map);
 
// ---------- 7. CUSTOM SIDEBAR LAYER CONTROL (basemap switch + on/off overlays) ----------
const basemapList = document.getElementById('basemap-list');
Object.keys(basemaps).forEach(name=>{
  const row = document.createElement('label');
  row.className = 'opt' + (name===activeBasemapName ? ' active' : '');
  row.innerHTML = `<input type="radio" name="basemap" ${name===activeBasemapName?'checked':''}> ${name}`;
  row.querySelector('input').addEventListener('change',()=>{
    map.removeLayer(basemaps[activeBasemapName]);
    basemaps[name].addTo(map);
    activeBasemapName = name;
    document.querySelectorAll('#basemap-list .opt').forEach(el=>el.classList.remove('active'));
    row.classList.add('active');
  });
  basemapList.appendChild(row);
});
 
const overlayList = document.getElementById('overlay-list');
Object.entries(overlays).forEach(([name,layer])=>{
  const row = document.createElement('label');
  row.className = 'opt active';
  row.innerHTML = `<input type="checkbox" checked> ${name}`;
  row.querySelector('input').addEventListener('change', e=>{
    if(e.target.checked){ layer.addTo(map); row.classList.add('active'); }
    else{ map.removeLayer(layer); row.classList.remove('active'); }
  });
  overlayList.appendChild(row);
});
 