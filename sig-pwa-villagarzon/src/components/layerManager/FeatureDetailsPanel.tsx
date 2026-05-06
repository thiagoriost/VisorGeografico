import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import type { FeatureDetailsData } from "../../utils/interfaces";
import "./FeatureDetailsPanel.css";

/**
 * Props del panel flotante de detalles de feature.
 */
type FeatureDetailsPanelProps = {
  /** Datos del feature seleccionado. */
  details: FeatureDetailsData;
  /** Callback para cerrar el panel. */
  onClose: () => void;
};

/**
 * Panel draggable con detalle del elemento seleccionado en el mapa.
 */
export default function FeatureDetailsPanel({
  details,
  onClose,
}: FeatureDetailsPanelProps) {
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const panelRef = useRef<HTMLDivElement | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  useEffect(() => {
    setMinimized(false);
  }, [details]);

  /**
   * Aplica la posicion del panel sobre el DOM para evitar estilos inline en JSX.
   */
  useEffect(() => {
    if (!panelRef.current) return;
    panelRef.current.style.left = `${position.x}px`;
    panelRef.current.style.top = `${position.y}px`;
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (event: globalThis.MouseEvent) => {
      if (!isDraggingRef.current) return;

      const nextX = event.clientX - dragOffsetRef.current.x;
      const nextY = event.clientY - dragOffsetRef.current.y;
      setPosition({ x: Math.max(8, nextX), y: Math.max(8, nextY) });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  /**
   * Inicia la interaccion de arrastre cuando se presiona el encabezado.
   */
  const startDragging = (event: ReactMouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;

    isDraggingRef.current = true;
    dragOffsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
  };

  return (
    <div
      ref={panelRef}
      className={`feature-details-panel${minimized ? " feature-details-panel--minimized" : ""}`}
    >
      <div className="feature-details-panel__header" onMouseDown={startDragging}>
        <strong className="feature-details-panel__title">Detalles del feature</strong>

        <div className="feature-details-panel__actions">
          <button
            type="button"
            className="feature-details-panel__btn"
            onClick={() => setMinimized((prev) => !prev)}
          >
            {minimized ? "Expandir" : "Minimizar"}
          </button>

          <button
            type="button"
            className="feature-details-panel__btn feature-details-panel__btn--danger"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="feature-details-panel__body">
          <p className="feature-details-panel__name">{details.featureName}</p>
          <p className="feature-details-panel__line">Latitud: {details.lat.toFixed(6)}</p>
          <p className="feature-details-panel__line">Longitud: {details.lon.toFixed(6)}</p>

          {details.imageUrl ? (
            <div className="feature-details-panel__image-wrap">
              <img
                src={details.imageUrl}
                alt={`Imagen de ${details.featureName}`}
                className="feature-details-panel__image"
              />
            </div>
          ) : (
            <div className="feature-details-panel__image-placeholder">
              Espacio reservado para imagen del centro educativo
            </div>
          )}
        </div>
      )}
    </div>
  );
}
