import { basemaps } from "../../config/basemaps";
import "./BasemapSwitcher.css";

/**
 * Props del selector de mapas base.
 */
interface Props {
  /** Callback que actualiza el estilo base activo en el mapa. */
  onChange: (style: string | object) => void;
  /** Estilo base actualmente activo. */
  mapaBase: string | object;
}

/**
 * Selector flotante para cambiar entre mapas base configurados.
 */
const BasemapSwitcher = ({ onChange, mapaBase }: Props) => {
  /**
   * Maneja el cambio de opcion y emite el estilo asociado al id seleccionado.
   */
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = basemaps.find((b) => b.id === e.target.value);
    if (selected) onChange(selected.style);
  };

  return (
    <section className="basemap-switcher" aria-label="Selector de mapas base">
      <p className="basemap-switcher__title">Mapas base</p>
      <select
        onChange={handleChange}
        value={basemaps.find((b) => b.style === mapaBase)?.id}
        className="basemap-switcher__select"
      >
        {basemaps.map((basemap) => (
          <option key={basemap.id} value={basemap.id}>
            {basemap.name}
          </option>
        ))}
      </select>
    </section>
  );
};

export default BasemapSwitcher;