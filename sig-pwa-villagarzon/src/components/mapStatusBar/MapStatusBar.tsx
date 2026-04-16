import React from "react";

interface Props {
    lat: number;
    lng: number;
    zoom: number;
    lat4686: number;
    lng4686: number;
}

const MapStatusBar: React.FC<Props> = ({ lat, lng, lat4686, lng4686,zoom }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "8px 12px",
        borderRadius: "6px",
        fontSize: "12px"
      }}
    >
      <div><strong>WGS84</strong></div>
      <div>Lat: {lat.toFixed(6)}</div>
      <div>Lng: {lng.toFixed(6)}</div>

      <div style={{ marginTop: "5px" }}>
        <strong>EPSG:4686</strong>
      </div>
      <div>Lat: {lat4686.toFixed(6)}</div>
      <div>Lng: {lng4686.toFixed(6)}</div>

      <div style={{ marginTop: "5px" }}>
        Zoom: {zoom.toFixed(2)}
      </div>
    </div>
  );
};

export default MapStatusBar;