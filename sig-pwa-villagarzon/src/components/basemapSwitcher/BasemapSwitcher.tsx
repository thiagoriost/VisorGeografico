import { basemaps } from "../../config/basemaps";

interface Props {
  onChange: (style: string | object) => void;
}

const BasemapSwitcher = ({ onChange }: Props) => {
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
      background: "white",
      padding: "8px",
      borderRadius: "5px"
    }}>
      <p>Mapas base</p>
      <select onChange={handleChange}>
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