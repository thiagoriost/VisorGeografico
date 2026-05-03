import "./LayerLoading.css";

type LayerLoadingProps = {
  layerName: string;
};

export default function LayerLoading({ layerName }: LayerLoadingProps) {
  return (
    <div className="layer-loading__overlay" role="status" aria-live="polite">
      <div className="layer-loading__box">
        <div className="layer-loading__spinner" aria-hidden="true" />
        <p className="layer-loading__text">Cargando</p>
        <p className="layer-loading__name">{layerName}</p>
        <p className="layer-loading__hint">Consultando servidor remoto…</p>
      </div>
    </div>
  );
}
