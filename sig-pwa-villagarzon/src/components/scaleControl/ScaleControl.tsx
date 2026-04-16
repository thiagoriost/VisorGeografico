/* 
Resolución = (cos(lat) * 2πR) / (256 * 2^zoom)
Escala gráfica = resolución * anchoPixels
 */

import React, { useState, useEffect } from "react";

interface Props {
  map: {
    getZoom: () => number;
    zoomTo: (zoom: number) => void;
    on: (event: string, callback: () => void) => void;
    off: (event: string, callback: () => void) => void;
  } | null;
}

const scales = [
  500, 1000, 2000, 5000, 10000, 25000, 50000,
  100000, 250000, 500000, 1000000, 5000000,
  10000000, 50000000, 100000000, 500000000,
];

const ScaleControl: React.FC<Props> = ({ map }) => {
  const [scale, setScale] = useState(0);

  const getScale = () => {
    if (!map) return;

    const zoom = map.getZoom();
    const scale = 591657550.5 / Math.pow(2, zoom);
    setScale(Math.round(scale));
  };

  const setMapScale = (value: number) => {
    if (!map) return;

    const zoom = Math.log2(591657550.5 / value);
    map.zoomTo(zoom);
  };

  useEffect(() => {
    if (!map) return;

    map.on("zoom", getScale);

     
    getScale();

    return () => {
      map.off("zoom", getScale);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 95,
        right: 10,
        zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "10px",
        borderRadius: "6px",
        fontSize: "12px"
      }}
    >
      <div>Escala 1:{scale.toLocaleString()}</div>

      <select
        value={scales.reduce((prev, curr) =>
          Math.abs(curr - scale) < Math.abs(prev - scale) ? curr : prev
        )}
        onChange={(e) => setMapScale(Number(e.target.value))}
        style={{
          width: "150px",
          marginTop: "5px"
        }}
      >
        {scales.map((s) => (
          <option key={s} value={s}>
            1:{s.toLocaleString()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ScaleControl;