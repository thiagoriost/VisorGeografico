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

// MAGNA Colombia Bogotá
proj4.defs(
  "EPSG:3116",
  "+proj=tmerc +lat_0=4.596200416666666 +lon_0=-74.07750791666666 +k=1 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +units=m +no_defs"
);

// MAGNA Colombia Oeste
proj4.defs(
  "EPSG:9377",
  "+proj=tmerc +lat_0=4 +lon_0=-77.07750791666666 +k=1 +x_0=5000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"
);

// UTM automática Colombia
export const getUTMZone = (lng: number) => {
  return Math.floor((lng + 180) / 6) + 1;
};

export const toUTM = (lng: number, lat: number) => {
  const zone = getUTMZone(lng);
  const hemisphere = lat >= 0 ? "north" : "south";

  const utmProj = `+proj=utm +zone=${zone} +${hemisphere} +datum=WGS84 +units=m +no_defs`;

  return {
    zone,
    coords: proj4("EPSG:4326", utmProj, [lng, lat])
  };
};

export const to4686 = (lng: number, lat: number) => {
  return proj4("EPSG:4326", "EPSG:4686", [lng, lat]);
};

export const to3116 = (lng: number, lat: number) =>
  proj4("EPSG:4326", "EPSG:3116", [lng, lat]);

export const to9377 = (lng: number, lat: number) =>
  proj4("EPSG:4326", "EPSG:9377", [lng, lat]);