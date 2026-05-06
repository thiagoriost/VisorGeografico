import React, { useEffect, useRef, useState } from "react";
import maplibregl, { Marker, LngLat } from "maplibre-gl";
import { HomeIcon, LocationIcon, NextIcon, PrevIcon, ZoomInIcon, ZoomOutIcon } from "./Icons";
import Button from "../roundButton/Button";
import type { Props } from "../../utils/interfaces";
import "./MapControls.css";

/** Vista del mapa (centro + zoom) para el historial de navegación. */
interface MapView {
  center: LngLat;
  zoom: number;
}

/**
 * Props del componente de controles de mapa.
 */
interface MapControlsProps {
  /** Instancia activa del mapa para ejecutar navegacion y zoom. */
  map: Props["map"];
}

/**
 * Controles de navegación del mapa.
 *
 * Incluye: Home, Zoom In/Out, Mi ubicación,
 * navegación de vistas anterior/siguiente.
 */
const MapControls: React.FC<MapControlsProps> = ({ map }) => {
  const history = useRef<MapView[]>([]);
  const future = useRef<MapView[]>([]);
  const isNavigating = useRef(false);
  const initialViewRef = useRef<MapView | null>(null);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const locationMarker = useRef<Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    const init: MapView = {
      center: map.getCenter(),
      zoom: map.getZoom()
    };

    initialViewRef.current = init;
    history.current.push(init);

    /**
     * Guarda la vista actual en el historial cuando el mapa termina de moverse.
     * Se ignora si el movimiento fue disparado por navegación programática.
     */
    const saveHistory = () => {
      if (isNavigating.current) {
        isNavigating.current = false;
        return;
      }

      const view: MapView = {
        center: map.getCenter(),
        zoom: map.getZoom()
      };

      history.current.push(view);
      future.current = [];

      setHasPrev(history.current.length > 1);
      setHasNext(false);
    };

    map.on("moveend", saveHistory);

    return () => {
      map.off("moveend", saveHistory);
    };
  }, [map]);

  /** Vuela a la vista inicial del mapa. */
  const goHome = () => {
    if (!initialViewRef.current || !map) return;

    isNavigating.current = true;
    map.flyTo(initialViewRef.current);
  };

  /** Incrementa el nivel de zoom en 1. */
  const zoomIn = () => map?.zoomIn();

  /** Decrementa el nivel de zoom en 1. */
  const zoomOut = () => map?.zoomOut();

  /** Navega a la vista anterior en el historial. */
  const goPrevious = () => {
    if (history.current.length <= 1 || !map) return;

    const current = history.current.pop()!;
    future.current.push(current);

    const prev = history.current[history.current.length - 1];

    isNavigating.current = true;
    map.flyTo(prev);

    setHasPrev(history.current.length > 1);
    setHasNext(true);
  };

  /** Navega a la vista siguiente en el historial. */
  const goNext = () => {
    if (!future.current.length || !map) return;

    const next = future.current.pop()!;
    history.current.push(next);

    isNavigating.current = true;
    map.flyTo(next);

    setHasPrev(true);
    setHasNext(future.current.length > 0);
  };

  /**
   * Centra el mapa en la ubicación del usuario y agrega un marcador.
   * Si ya existe un marcador, lo elimina (toggle).
   */
  const goMyLocation = () => {
    if (locationMarker.current) {
      locationMarker.current.remove();
      locationMarker.current = null;
      return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      if (!map) return;

      const { latitude, longitude } = pos.coords;

      map.flyTo({
        center: [longitude, latitude],
        zoom: 15
      });

      const el = document.createElement("div");
      el.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 24 24">
          <path fill="#2563eb" d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>
      `;

      locationMarker.current = new maplibregl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .addTo(map);
    });
  };

  return (
    <div className="map-controls">

      <Button
        tooltip="Home"
        onClick={goHome}
        wrapperClassName="map-controls__item"
        buttonClassName="map-controls__button"
        tooltipClassName="map-controls__tooltip"
      >
        <HomeIcon/>
      </Button>

      <Button
        tooltip="Zoom In"
        onClick={zoomIn}
        wrapperClassName="map-controls__item"
        buttonClassName="map-controls__button"
        tooltipClassName="map-controls__tooltip"
      >
        <ZoomInIcon/>
      </Button>

      <Button
        tooltip="Zoom Out"
        onClick={zoomOut}
        wrapperClassName="map-controls__item"
        buttonClassName="map-controls__button"
        tooltipClassName="map-controls__tooltip"
      >
        <ZoomOutIcon/>
      </Button>

      <Button
        tooltip="Mi ubicación"
        onClick={goMyLocation}
        wrapperClassName="map-controls__item"
        buttonClassName="map-controls__button"
        tooltipClassName="map-controls__tooltip"
      >
        <LocationIcon/>
      </Button>

      <Button
        tooltip="Vista anterior"
        onClick={goPrevious}
        disabled={!hasPrev}
        wrapperClassName="map-controls__item"
        buttonClassName="map-controls__button"
        tooltipClassName="map-controls__tooltip"
      >
        <PrevIcon/>
      </Button>

      <Button
        tooltip="Vista siguiente"
        onClick={goNext}
        disabled={!hasNext}
        wrapperClassName="map-controls__item"
        buttonClassName="map-controls__button"
        tooltipClassName="map-controls__tooltip"
      >
        <NextIcon/>
      </Button>

    </div>
  );
};

export default MapControls;