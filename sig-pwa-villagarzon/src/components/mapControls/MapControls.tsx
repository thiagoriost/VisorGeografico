import React, { useEffect, useRef, useState } from "react";

interface Props {
  map: any;
}

const MapControls: React.FC<Props> = ({ map }) => {
  const history = useRef<any[]>([]);
  const future = useRef<any[]>([]);
  const [initialView, setInitialView] = useState<any>(null);

  useEffect(() => {
    if (!map) return;

    const center = map.getCenter();
    const zoom = map.getZoom();

    setInitialView({
      center,
      zoom
    });

    const saveHistory = () => {
      history.current.push({
        center: map.getCenter(),
        zoom: map.getZoom()
      });

      future.current = [];
    };

    map.on("moveend", saveHistory);

    return () => {
      map.off("moveend", saveHistory);
    };
  }, [map]);

  const goHome = () => {
    if (!initialView) return;

    map.flyTo({
      center: initialView.center,
      zoom: initialView.zoom
    });
  };

  const zoomIn = () => map.zoomIn();
  const zoomOut = () => map.zoomOut();

  const goPrevious = () => {
    if (history.current.length < 2) return;

    const current = history.current.pop();
    future.current.push(current);

    const prev = history.current[history.current.length - 1];

    map.flyTo(prev);
  };

  const goNext = () => {
    if (!future.current.length) return;

    const next = future.current.pop();
    history.current.push(next);

    map.flyTo(next);
  };

  const goMyLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;

      map.flyTo({
        center: [longitude, latitude],
        zoom: 14
      });
    });
  };

  const btnStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(6px)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    cursor: "pointer",
    fontSize: "16px"
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        left: 16,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}
    >
      <button style={btnStyle} onClick={goHome}>🏠</button>
      <button style={btnStyle} onClick={zoomIn}>+</button>
      <button style={btnStyle} onClick={zoomOut}>−</button>
      <button style={btnStyle} onClick={goMyLocation}>📍</button>
      <button style={btnStyle} onClick={goPrevious}>⬅️</button>
      <button style={btnStyle} onClick={goNext}>➡️</button>
    </div>
  );
};

export default MapControls;