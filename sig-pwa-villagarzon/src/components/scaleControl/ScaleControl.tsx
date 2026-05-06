/* 
Resolución = (cos(lat) * 2πR) / (256 * 2^zoom)
Escala gráfica = resolución * anchoPixels
 */

import React, { useState, useEffect } from "react";
import "./ScaleControl.css";

/**
 * Props del control de escala numerica del mapa.
 */
interface Props {
  /** Instancia de mapa con metodos minimos para lectura/ajuste de zoom. */
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

/**
 * Control flotante para visualizar y ajustar escala nominal mediante zoom.
 */
const ScaleControl: React.FC<Props> = ({ map }) => {
  const [scale, setScale] = useState(0);

  /**
   * Calcula la escala nominal actual del mapa a partir del nivel de zoom.
   */
  const getScale = () => {
    if (!map) return;

    const zoom = map.getZoom();
    const scale = 591657550.5 / Math.pow(2, zoom);
    setScale(Math.round(scale));
  };

  /**
   * Ajusta el zoom del mapa para aproximarse a la escala seleccionada.
   */
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
    <section className="scale-control" aria-label="Control de escala">
      <div className="scale-control__value">Escala 1:{scale.toLocaleString()}</div>

      <select
        value={scales.reduce((prev, curr) =>
          Math.abs(curr - scale) < Math.abs(prev - scale) ? curr : prev
        )}
        onChange={(e) => setMapScale(Number(e.target.value))}
        className="scale-control__select"
      >
        {scales.map((s) => (
          <option key={s} value={s}>
            1:{s.toLocaleString()}
          </option>
        ))}
      </select>
    </section>
  );
};

export default ScaleControl;