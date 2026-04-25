import React, { useEffect, useState } from "react";
import type { Props } from "../../utils/interfaces";

const ScaleBar: React.FC<Props> = ({ map }) => {
  const [scaleWidth, setScaleWidth] = useState(100);
  const [scaleText, setScaleText] = useState("100 m");

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

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        right: 10,
        zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "8px",
        borderRadius: "6px"
      }}
    >
      <div
        style={{
          width: `${scaleWidth}px`,
          height: "4px",
          background: "white",
          marginBottom: "4px"
        }}
      />

      <div style={{ fontSize: "12px" }}>
        {scaleText}
      </div>
    </div>
  );
};

export default ScaleBar;