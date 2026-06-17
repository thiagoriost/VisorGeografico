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
// import LayerTableOfContents from "./layerTableOfContents/LayerTableOfContents";
import LayerManager from "./layerManager/LayerManager";
import FeatureDetailsPanel from "./layerManager/FeatureDetailsPanel";
import type { FeatureDetailsData } from "../utils/interfaces";
import MobileWidgetsMenu, {
  type MobileWidgetId,
} from "./mobileMenu/MobileWidgetsMenu";

const MOBILE_BREAKPOINT_QUERY = "(max-width: 767px)";

const getInitialMobileState = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
};

/**
 * Retorna la funcionalidad activa inicial para modo movil.
 */
const getInitialActiveMobileWidget = (): MobileWidgetId => "";

/**
 * Vista principal del mapa con controles de escritorio y menu contextual en movil.
 */
const MapView = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [modoMovil, setModoMovil] = useState(getInitialMobileState);
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
  const [selectedFeatureDetails, setSelectedFeatureDetails] =
    useState<FeatureDetailsData | null>(null);
  const [activeMobileWidget, setActiveMobileWidget] =
    useState<MobileWidgetId | null>(getInitialActiveMobileWidget);
  const [isMobileMenuExpanded, setIsMobileMenuExpanded] = useState(false);

  useEffect(() => {
    /* alert(`
      Realizar ajustes en modo movil
      `) */
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    const syncMobileMode = (event: MediaQueryListEvent) => {
      setModoMovil(event.matches);
    };

    mediaQuery.addEventListener("change", syncMobileMode);

    return () => {
      mediaQuery.removeEventListener("change", syncMobileMode);
    };
  }, []);

  /**
   * En desktop no aplica menu; en movil restaura funcionalidad por defecto.
   */
  useEffect(() => {
    if (modoMovil) {
      setActiveMobileWidget((prev) => prev ?? getInitialActiveMobileWidget());
      return;
    }

    setIsMobileMenuExpanded(false);
    setActiveMobileWidget(null);
  }, [modoMovil]);

  useEffect(() => {
    
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

    /**
     * Cierra el menu hamburger movil al interactuar con el mapa.
     */
    const handleMapInteraction = () => {
      setIsMobileMenuExpanded(false);
    };

    mapRef.current.on("click", handleMapInteraction);
    mapRef.current.on("touchstart", handleMapInteraction);

    return () => {
      mapRef.current?.off("click", handleMapInteraction);
      mapRef.current?.off("touchstart", handleMapInteraction);
      map.remove();
    };
  }, [mapaBase]);

  const changeBasemap = (newStyle: string | object) => {
    setMapaBase(newStyle);
    setZoom(mapConfig.zoom); // Reiniciar zoom al cambiar mapa base
  };

  /**
   * Cambia la herramienta activa en movil garantizando una sola abierta a la vez.
   */
  const handleSelectMobileWidget = (widget: MobileWidgetId) => {
    setActiveMobileWidget((prev) => {
      if (prev === widget) return null;
      return widget;
    });
    setIsMobileMenuExpanded(false);
  };

  /**
   * Alterna el estado visual del menu hamburger en movil.
   */
  const handleToggleMobileMenu = () => {
    setIsMobileMenuExpanded((prev) => !prev);
  };

  /**
   * Cierra por completo el widget de capas en movil, liberando su renderizado.
   */
  const handleCloseMobileLayerManager = () => {
    setActiveMobileWidget(null);
  };

  return (
    <>
      <MapHeader
        title="Sistema de Información Geográfico"
        subtitle="Visor Territorial"
        logo="/logo.png"
      />

      <MapControls map={mapRef.current} />

      {!modoMovil && (
        <>
          <BasemapSwitcher onChange={changeBasemap} mapaBase={mapaBase} />
          <ScaleBar map={mapRef.current} />
          <ScaleControl map={mapRef.current} />
          <LayerManager
            map={mapRef.current}
            onFeatureDetailsChange={setSelectedFeatureDetails}
          />
          <MapStatusBar
              lat={lat}
              lng={lng}
              lat4686={lat4686}
              lng4686={lng4686}
              zoom={zoom}
              epsg3116={epsg3116}
              epsg9377={epsg9377}
              utm={utm}
              utmZone={utmZone}
            />
        </>
      )}

      {modoMovil && (
        <>
          <MobileWidgetsMenu
            activeWidget={activeMobileWidget}
            onSelectWidget={handleSelectMobileWidget}
            isExpanded={isMobileMenuExpanded}
            onToggleMenu={handleToggleMobileMenu}
          />

          {activeMobileWidget === "basemap" && (
            <BasemapSwitcher onChange={changeBasemap} mapaBase={mapaBase} />
          )}

          {activeMobileWidget === "scaleBar" && (
            <ScaleBar map={mapRef.current} />
          )}

          {activeMobileWidget === "scaleControl" && (
            <ScaleControl map={mapRef.current} />
          )}

          {activeMobileWidget === "layerManager" && (
            <LayerManager
              map={mapRef.current}
              onFeatureDetailsChange={setSelectedFeatureDetails}
              onRequestClose={handleCloseMobileLayerManager}
            />
          )}

          {activeMobileWidget === "mapStatusBar" && (
            <MapStatusBar
              lat={lat}
              lng={lng}
              lat4686={lat4686}
              lng4686={lng4686}
              zoom={zoom}
              epsg3116={epsg3116}
              epsg9377={epsg9377}
              utm={utm}
              utmZone={utmZone}
            />
          )}
        </>
      )}

      {selectedFeatureDetails && (
        <FeatureDetailsPanel
          details={selectedFeatureDetails}
          onClose={() => setSelectedFeatureDetails(null)}
        />
      )}

      <div
          ref={mapContainer}
          style={{ width: "100%", height: "100vh" }}
      />
    </>
  );
};

export default MapView;