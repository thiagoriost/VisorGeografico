/// <reference types="vite/client" />

/**
 * Variables de entorno disponibles para el cliente Vite.
 */
interface ImportMetaEnv {
  /** API key de MapTiler para consumir estilos protegidos. */
  readonly VITE_MAPTILER_API_KEY?: string;
  /** API key/token opcional para servicios ArcGIS protegidos. */
  readonly VITE_ARCGIS_API_KEY?: string;
}

/**
 * Metadatos de modulo expuestos por Vite.
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
