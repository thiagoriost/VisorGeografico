import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import type { FeatureDetailsData } from "../../utils/interfaces";
import "./FeatureDetailsPanel.css";

type FeatureDetailsPanelProps = {
  details: FeatureDetailsData;
  onClose: () => void;
};

export default function FeatureDetailsPanel({
  details,
  onClose,
}: FeatureDetailsPanelProps) {
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  useEffect(() => {
    setMinimized(false);
  }, [details]);

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
      className={`feature-details-panel${minimized ? " feature-details-panel--minimized" : ""}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div
        className="feature-details-panel__header"
        onMouseDown={startDragging}
      >
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
