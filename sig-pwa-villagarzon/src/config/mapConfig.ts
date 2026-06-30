import { basemaps } from "./basemaps";

/**
 * Configuracion inicial del mapa.
 *
 * @remarks
 * El mapa base por defecto usa OpenStreetMap (indice 1) porque no requiere
 * clave de proveedor. Satelital_1 (indice 2) requiere VITE_MAPTILER_API_KEY
 * configurada en `.env.local` antes de poder usarse.
 */
export const mapConfig = {
  /** Coordenadas de centrado inicial del visor en Villagarzon. */
  center: [-76.616553, 1.026411],
  /** Nivel de zoom inicial. */
  zoom: 12,
  /**
   * Estilo de mapa base inicial.
   *
   * Apunta a OSM (basemaps[1]) para garantizar que el visor cargue
   * sin depender de claves externas en el arranque.
   */
  mapaBase: basemaps[2].style
};