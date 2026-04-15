import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { mapConfig } from "../config/mapConfig";
import BasemapSwitcher from "./basemapSwitcher/BasemapSwitcher";


const MapView = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [style, setStyle] = useState<string | object>(
    "https://tiles.openfreemap.org/styles/liberty"
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: style as maplibregl.StyleSpecification | string,
      center: mapConfig.center as [number, number], // Pasto ejemplo
      zoom: mapConfig.zoom
    });

    mapRef.current = map;
    return () => map.remove()
  }, [style]);

  const changeBasemap = (newStyle: string | object) => {
    setStyle(newStyle);
  };

  return (
    <>
        <BasemapSwitcher onChange={changeBasemap} />
        <div
        ref={mapContainer}
        style={{ width: "100%", height: "100vh" }}
        />
    </>
  );
};

export default MapView;