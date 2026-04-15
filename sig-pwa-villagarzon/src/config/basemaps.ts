export const basemaps = [
  {
    id: "streets",
    name: "Calles",
    style: "https://demotiles.maplibre.org/style.json"
  },
  {
    id: "osm",
    name: "OpenStreetMap",
    style: "https://tiles.openfreemap.org/styles/liberty"
  },
  {
    id: "satellite",
    name: "Satelital_1",
    style: "https://api.maptiler.com/maps/hybrid/style.json?key=p8Ig7jrgPHwhUsm7Fj5z"
  },
  {
    id: "satellite_2",
    name: "Satelital_2",
    // style: "https://api.maptiler.com/maps/hybrid/style.json?key=p8Ig7jrgPHwhUsm7Fj5z"
    style: {
    version: 8,
    sources: {
      satellite: {
        type: "raster",
        tiles: [
          "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        ],
        tileSize: 256
      }
    },
    layers: [
      {
        id: "satellite",
        type: "raster",
        source: "satellite"
      }
    ]
  }
  }
];