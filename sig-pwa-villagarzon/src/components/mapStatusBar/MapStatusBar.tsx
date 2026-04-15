import React from "react";

interface Props {
  lat: number;
  lng: number;
  zoom: number;
}

const MapStatusBar: React.FC<Props> = ({ lat, lng, zoom }) => {
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
      <div>Lat: {lat.toFixed(6)}</div>
      <div>Lng: {lng.toFixed(6)}</div>
      <div>Zoom: {zoom.toFixed(2)}</div>
    </div>
  );
};

export default MapStatusBar;