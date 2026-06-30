import type { StyleSpecification } from "maplibre-gl";

/**
 * Claves de proveedores leidas desde variables de entorno Vite.
 */
const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY?.trim() ?? "";
const ARCGIS_API_KEY = import.meta.env.VITE_ARCGIS_API_KEY?.trim() ?? "";

/**
 * Contrato de una opcion de mapa base consumida por los widgets del visor.
 */
interface BasemapOption {
  /** Identificador unico de la opcion en la UI. */
  id: string;
  /** Etiqueta visible para usuarios finales. */
  name: string;
  /** Estilo MapLibre en formato URL o estilo JSON. */
  style: string | StyleSpecification;
}

/**
 * Construye la URL de estilo hibrido de MapTiler usando una clave de entorno.
 *
 * Si no se define la clave, retorna OSM Liberty para evitar exponer credenciales
 * o romper el visor en entornos sin configuracion local.
 */
const buildMapTilerHybridStyle = (): string => {
  if (!MAPTILER_API_KEY) {
    return "https://tiles.openfreemap.org/styles/liberty";
  }

  const params = new URLSearchParams({ key: MAPTILER_API_KEY });
  return `https://api.maptiler.com/maps/hybrid/style.json?${params.toString()}`;
};

/**
 * Construye la URL de teselas de ArcGIS agregando token solo cuando existe.
 */
const buildArcGisWorldImageryTileUrl = (): string => {
  const baseUrl =
    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  if (!ARCGIS_API_KEY) {
    return baseUrl;
  }

  const params = new URLSearchParams({ token: ARCGIS_API_KEY });
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Lista de mapas base disponibles en el visor.
 */
export const basemaps: BasemapOption[] = [
  {
    id: "streets",
    name: "Político",
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
    style: buildMapTilerHybridStyle()
  },
  {
    id: "satellite_2",
    name: "Satelital_2",
    style: {
      version: 8,
      sources: {
        satellite: {
          type: "raster",
          tiles: [buildArcGisWorldImageryTileUrl()],
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