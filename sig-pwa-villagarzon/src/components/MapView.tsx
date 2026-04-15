import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { mapConfig } from "../config/mapConfig";
import BasemapSwitcher from "./basemapSwitcher/BasemapSwitcher";
import MapStatusBar from "./mapStatusBar/MapStatusBar";


const MapView = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [style, setStyle] = useState<string | object>(
    "https://tiles.openfreemap.org/styles/liberty"
  );
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [zoom, setZoom] = useState(mapConfig.zoom);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: style as maplibregl.StyleSpecification | string,
      center: mapConfig.center as [number, number], // Pasto ejemplo
      zoom: mapConfig.zoom
    });

    mapRef.current = map;

    // Evento movimiento cursor
    mapRef.current.on("mousemove", (e) => {
      setLat(e.lngLat.lat);
      setLng(e.lngLat.lng);
    });

    // Evento zoom
    mapRef.current.on("zoom", () => {
      const currentZoom = mapRef.current?.getZoom();
      if (currentZoom) setZoom(currentZoom);
    });

    return () => map.remove()
  }, [style]);

  const changeBasemap = (newStyle: string | object) => {
    setStyle(newStyle);
    setZoom(mapConfig.zoom); // Reiniciar zoom al cambiar mapa base
  };

  return (
    <>
        <BasemapSwitcher onChange={changeBasemap} />
        <MapStatusBar lat={lat} lng={lng} zoom={zoom} />
        <div
        ref={mapContainer}
        style={{ width: "100%", height: "100vh" }}
        />
    </>
  );
};

export default MapView;