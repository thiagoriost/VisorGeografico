import React, { useState } from "react";
import "./MapStatusBar.css";

/**
 * Props de la barra de estado cartografica.
 */
interface Props {
    /** Latitud WGS84 actual del cursor/centro segun origen de datos. */
    lat: number;
    /** Longitud WGS84 actual del cursor/centro segun origen de datos. */
    lng: number;
    /** Nivel de zoom actual del mapa. */
    zoom: number;
    /** Latitud transformada a EPSG:4686. */
    lat4686: number;
    /** Longitud transformada a EPSG:4686. */
    lng4686: number;
    /** Coordenadas [X, Y] en EPSG:3116. */
    epsg3116: number[];
    /** Coordenadas [X, Y] en EPSG:9377. */
    epsg9377: number[];
    /** Coordenadas UTM [E, N]. */
    utm: number[];
    /** Zona UTM activa. */
    utmZone: number;
}

/**
 * Barra de estado flotante con coordenadas en distintos sistemas de referencia.
 */
const MapStatusBar: React.FC<Props> = ({ lat, lng, lat4686, lng4686, zoom, epsg3116, epsg9377, utm, utmZone }) => {
  const [expanded, setExpanded] = useState(false);

  /** Alterna vista resumida y vista detallada de coordenadas. */
  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <div className="map-status-bar">
      <div className="map-status-bar__header">
        <strong className="map-status-bar__title">Coordenadas</strong>
        <button
          type="button"
          onClick={toggleExpanded}
          title={expanded ? "Mostrar menos" : "Mostrar más"}
          className="map-status-bar__toggle-btn"
        >
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      <div className="map-status-bar__section map-status-bar__section--compact">
        <strong>EPSG:4686</strong>
        <div>Lat: {lat4686.toFixed(6)}</div>
        <div>Lng: {lng4686.toFixed(6)}</div>
      </div>

      {expanded && (
        <>
          <div className="map-status-bar__section">
            <strong>EPSG:3116</strong>
            <div>X: {epsg3116[0].toFixed(2)}</div>
            <div>Y: {epsg3116[1].toFixed(2)}</div>
          </div>

          <div className="map-status-bar__section">
            <strong>EPSG:9377</strong>
            <div>X: {epsg9377[0].toFixed(2)}</div>
            <div>Y: {epsg9377[1].toFixed(2)}</div>
          </div>

          <div className="map-status-bar__section">
            <strong>UTM Zona {utmZone}</strong>
            <div>E: {utm[0].toFixed(2)}</div>
            <div>N: {utm[1].toFixed(2)}</div>
          </div>

          <div className="map-status-bar__section">
            <strong>WGS84</strong>
            <div>Lat: {lat.toFixed(6)}</div>
            <div>Lng: {lng.toFixed(6)}</div>
          </div>
        </>
      )}

      <div className="map-status-bar__section">
        Zoom: {zoom.toFixed(2)}
      </div>
    </div>
  );
};

export default MapStatusBar;