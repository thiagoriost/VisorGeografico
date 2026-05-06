import React, { useEffect, useRef, useState } from "react";
import type { Props } from "../../utils/interfaces";
import "./ScaleBar.css";

/**
 * Props del componente de barra de escala.
 */
interface ScaleBarProps {
  /** Instancia del mapa para leer centro/zoom y eventos de movimiento. */
  map: Props["map"];
}

/**
 * Barra grafica de escala que se recalcula en cada movimiento del mapa.
 */
const ScaleBar: React.FC<ScaleBarProps> = ({ map }) => {
  const [scaleWidth, setScaleWidth] = useState(100);
  const [scaleText, setScaleText] = useState("100 m");
  const scaleLineRef = useRef<HTMLDivElement | null>(null);

  /**
   * Calcula y actualiza ancho/etiqueta de la escala en funcion del zoom y latitud.
   */
  const updateScale = () => {
    if (!map) return;

    const zoom = map.getZoom();
    const center = map.getCenter();
    const lat = center.lat;

    const metersPerPixel =
      (156543.03392 * Math.cos((lat * Math.PI) / 180)) /
      Math.pow(2, zoom);

    const scaleMeters = metersPerPixel * 100;

    const niceScale = getNiceScale(scaleMeters);

    const width = niceScale / metersPerPixel;

    setScaleWidth(width);
    setScaleText(formatScale(niceScale));
  };

  /**
   * Normaliza la distancia a valores legibles para la barra grafica.
   */
  const getNiceScale = (meters: number) => {
    const scales = [
      1, 2, 5,
      10, 20, 50,
      100, 200, 500,
      1000, 2000, 5000,
      10000, 20000, 50000,
      100000
    ];

    for (const s of scales) {
      if (meters <= s) return s;
    }

    return meters;
  };

  /**
   * Formatea metros a metros o kilometros segun corresponda.
   */
  const formatScale = (meters: number) => {
    if (meters >= 1000) {
      return `${meters / 1000} km`;
    }
    return `${meters} m`;
  };

  useEffect(() => {
    if (!map) return;

    map.on("move", updateScale);
     
    updateScale();

    return () => {
      map.off("move", updateScale);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  /**
   * Aplica el ancho calculado a la barra sin usar estilos inline en JSX.
   */
  useEffect(() => {
    if (!scaleLineRef.current) return;
    scaleLineRef.current.style.width = `${scaleWidth}px`;
  }, [scaleWidth]);

  return (
    <section className="scale-bar" aria-label="Barra de escala">
      <div ref={scaleLineRef} className="scale-bar__line" />

      <div className="scale-bar__text">{scaleText}</div>
    </section>
  );
};

export default ScaleBar;