import React, { useState } from "react";
import "./MapStatusBar.css";

interface Props {
    lat: number;
    lng: number;
    zoom: number;
    lat4686: number;
    lng4686: number;
    epsg3116: number[];
    epsg9377: number[];
    utm: number[];
    utmZone: number;
}

const MapStatusBar: React.FC<Props> = ({ lat, lng, lat4686, lng4686, zoom, epsg3116, epsg9377, utm, utmZone }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="map-status-bar">
      <div className="map-status-bar__header">
        <strong>Coordenadas</strong>
        <button
          onClick={() => setExpanded(!expanded)}
          title={expanded ? "Mostrar menos" : "Mostrar más"}
          className="map-status-bar__toggle-btn"
        >
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      <div>
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