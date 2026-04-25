/* eslint-disable react-hooks/refs */
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { mapConfig } from "../config/mapConfig";
import BasemapSwitcher from "./basemapSwitcher/BasemapSwitcher";
import MapStatusBar from "./mapStatusBar/MapStatusBar";
import { to3116, to4686, to9377, toUTM } from "../utils/projections";
import ScaleControl from "./scaleControl/ScaleControl";
import ScaleBar from "./scaleBar/ScaleBar";
import MapHeader from "./mapHeader/MapHeader";
import MapControls from "./mapControls/MapControls";
import LayerTableOfContents from "./layerTableOfContents/LayerTableOfContents";
import LayerManager from "./layerManager/LayerManager";


const MapView = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapaBase, setMapaBase] = useState<string | object>(mapConfig.mapaBase);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [lat4686, setLat4686] = useState(0);
  const [lng4686, setLng4686] = useState(0);
  const [zoom, setZoom] = useState(mapConfig.zoom);
  const [utm, setUtm] = useState([0, 0]);
  const [utmZone, setUtmZone] = useState(0);

  const [epsg3116, set3116] = useState([0, 0]);
  const [epsg9377, set9377] = useState([0, 0]);

  useEffect(() => {
    alert(`Este visor es una versión de prueba y está en desarrollo. Algunas funcionalidades pueden no estar disponibles o no funcionar correctamente. ¡Gracias por tu comprensión!

      Quede en ajustar la data para agregar mas centros educativos, revisar el chatgpt y continuar con a ultima consulta falta implementarla "Ayúdame a producir una consulta para cargar TODO desde OpenStreetMap directo a mi visor" para agregar mas capas, y revisar el diseño del visor para hacerlo mas amigable.
      `)
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapaBase as maplibregl.StyleSpecification | string,
      center: mapConfig.center as [number, number],
      zoom: mapConfig.zoom
    });

    mapRef.current = map;

    // Evento movimiento cursor
    mapRef.current.on("mousemove", (e) => {
        const lat = e.lngLat.lat;
        const lng = e.lngLat.lng;
        setLat(lat);
        setLng(lng);
        const [lng4686, lat4686] = to4686(lng, lat);
        setLat4686(lat4686);
        setLng4686(lng4686);

        set3116(to3116(lng, lat));
        set9377(to9377(lng, lat));

        const utmData = toUTM(lng, lat);
        setUtm(utmData.coords);
        setUtmZone(utmData.zone);
    });

    // Evento zoom
    mapRef.current.on("zoom", () => {
      const currentZoom = mapRef.current?.getZoom();
      if (currentZoom) setZoom(currentZoom);
    });

    return () => map.remove()
  }, [mapaBase]);

  const changeBasemap = (newStyle: string | object) => {
    setMapaBase(newStyle);
    setZoom(mapConfig.zoom); // Reiniciar zoom al cambiar mapa base
  };

  return (
    <>
        <MapHeader
          title="Sistema de Información Geográfico"
          subtitle="Visor Territorial"
          logo="/logo.png"
        />
        <MapControls map={mapRef.current} />
        <BasemapSwitcher onChange={changeBasemap} mapaBase={mapaBase} />
        <MapStatusBar lat={lat} lng={lng} lat4686={lat4686} lng4686={lng4686} zoom={zoom} epsg3116={epsg3116} epsg9377={epsg9377} utm={utm} utmZone={utmZone} />
        <ScaleBar map={mapRef.current} />
        <ScaleControl map={mapRef.current} />
        {/* <LayerTableOfContents map={mapRef.current} /> */}
        <LayerManager map={mapRef.current}/>
        <div
          ref={mapContainer}
          style={{ width: "100%", height: "100vh" }}
        />
    </>
  );
};

export default MapView;