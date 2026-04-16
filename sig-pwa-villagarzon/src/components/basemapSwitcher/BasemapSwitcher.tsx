import { basemaps } from "../../config/basemaps";

interface Props {
  onChange: (style: string | object) => void;
  mapaBase: string | object;
}

const BasemapSwitcher = ({ onChange, mapaBase }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = basemaps.find((b) => b.id === e.target.value);
    if (selected) onChange(selected.style);
  };

  return (
    <div style={{
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 1000,
      background: "rgba(0,0,0,0.7)",
      color: "white",

      padding: "8px",
      borderRadius: "5px"
    }}>
      <p>Mapas base</p>
      <select onChange={handleChange} value={basemaps.find((b) => b.style === mapaBase)?.id}>
        {basemaps.map((basemap) => (
          <option key={basemap.id} value={basemap.id}>
            {basemap.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BasemapSwitcher;