import React from "react";
import "./MapHeader.css";

/**
 * Props del encabezado flotante del mapa.
 */
interface Props {
  /** Titulo principal mostrado en el encabezado. */
  title: string;
  /** Subtitulo opcional con contexto adicional. */
  subtitle?: string;
  /** URL opcional del logo institucional. */
  logo?: string;
}

/**
 * Encabezado visual del mapa con titulo, subtitulo y logo opcional.
 */
const MapHeader: React.FC<Props> = ({ title, subtitle, logo }) => {
  return (
    <header className="map-header" aria-label="Encabezado del mapa">
      {logo && (
        <img
          src={logo}
          alt="logo"
          className="map-header__logo"
        />
      )}

      <div className="map-header__content">
        <div className="map-header__title">{title}</div>

        {subtitle && (
          <div className="map-header__subtitle">{subtitle}</div>
        )}
      </div>
    </header>
  );
};

export default MapHeader;