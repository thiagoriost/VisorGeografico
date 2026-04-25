import React, { useEffect, useRef, useState } from "react";
import maplibregl, { Marker, LngLat } from "maplibre-gl";
import { HomeIcon, LocationIcon, NextIcon, PrevIcon, ZoomInIcon, ZoomOutIcon } from "./Icons";
import Button from "../roundButton/Button";
import type { Props } from "../../utils/interfaces";

/** Vista del mapa (centro + zoom) para el historial de navegación. */
interface MapView {
  center: LngLat;
  zoom: number;
}



/**
 * Controles de navegación del mapa.
 *
 * Incluye: Home, Zoom In/Out, Mi ubicación,
 * navegación de vistas anterior/siguiente.
 */
const MapControls: React.FC<Props> = ({ map }) => {
  const history = useRef<MapView[]>([]);
  const future = useRef<MapView[]>([]);
  const isNavigating = useRef(false);
  const [initialView, setInitialView] = useState<MapView | null>(null);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const locationMarker = useRef<Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    const init: MapView = {
      center: map.getCenter(),
      zoom: map.getZoom()
    };

    setInitialView(init);
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
    if (!initialView || !map) return;

    isNavigating.current = true;
    map.flyTo(initialView);
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

  // STYLE
  const btnStyle: React.CSSProperties = {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(6px)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all .2s ease"
  };

  const disabledStyle: React.CSSProperties = {
    opacity: .4,
    cursor: "not-allowed"
  };

  const hoverStyle: React.CSSProperties = {
    transform: "scale(1.05)",
    background: "rgba(0,0,0,1)",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 100,
        left: 16,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}
    >

      <Button tooltip="Home" onClick={goHome} btnStyle={btnStyle} hoverStyle={hoverStyle} disabledStyle={disabledStyle}>
        <HomeIcon/>
      </Button>

      <Button tooltip="Zoom In" onClick={zoomIn} btnStyle={btnStyle} hoverStyle={hoverStyle} disabledStyle={disabledStyle}>
        <ZoomInIcon/>
      </Button>

      <Button tooltip="Zoom Out" onClick={zoomOut} btnStyle={btnStyle} hoverStyle={hoverStyle} disabledStyle={disabledStyle}>
        <ZoomOutIcon/>
      </Button>

      <Button tooltip="Mi ubicación" onClick={goMyLocation} btnStyle={btnStyle} hoverStyle={hoverStyle} disabledStyle={disabledStyle}>
        <LocationIcon/>
      </Button>

      <Button
        tooltip="Vista anterior"
        onClick={goPrevious}
        disabled={!hasPrev}
        btnStyle={btnStyle} hoverStyle={hoverStyle} disabledStyle={disabledStyle}
      >
        <PrevIcon/>
      </Button>

      <Button
        tooltip="Vista siguiente"
        onClick={goNext}
        disabled={!hasNext}
        btnStyle={btnStyle} hoverStyle={hoverStyle} disabledStyle={disabledStyle}
      >
        <NextIcon/>
      </Button>

    </div>
  );
};

export default MapControls;