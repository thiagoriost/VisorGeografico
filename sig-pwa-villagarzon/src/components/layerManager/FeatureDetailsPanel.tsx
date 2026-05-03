import "./FeatureDetailsPanel.css";

type SelectedFeatureDetails = {
  featureName: string;
  lat: number;
  lon: number;
  imageUrl?: string;
};

type FeatureDetailsPanelProps = {
  details: SelectedFeatureDetails;
  minimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
};

export default function FeatureDetailsPanel({
  details,
  minimized,
  onToggleMinimize,
  onClose,
}: FeatureDetailsPanelProps) {
  return (
    <div className={`feature-details-panel${minimized ? " feature-details-panel--minimized" : ""}`}>
      <div className="feature-details-panel__header">
        <strong className="feature-details-panel__title">Detalles del feature</strong>

        <div className="feature-details-panel__actions">
          <button
            type="button"
            className="feature-details-panel__btn"
            onClick={onToggleMinimize}
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
