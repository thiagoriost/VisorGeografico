import proj4 from "proj4";

// EPSG:4326 (default MapLibre)
proj4.defs(
  "EPSG:4326",
  "+proj=longlat +datum=WGS84 +no_defs"
);

// EPSG:4686 (MAGNA-SIRGAS)
proj4.defs(
  "EPSG:4686",
  "+proj=longlat +ellps=GRS80 +no_defs"
);

export const to4686 = (lng: number, lat: number) => {
  return proj4("EPSG:4326", "EPSG:4686", [lng, lat]);
};